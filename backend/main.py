import os
import json
import sys
from typing import TypedDict

from dotenv import load_dotenv

from langchain.chat_models import init_chat_model
from langchain_core.tools import tool

from langgraph.prebuilt import ToolNode
from langgraph.graph import StateGraph, START, END, MessagesState
from langchain_core.messages import ToolMessage, SystemMessage, HumanMessage

load_dotenv()


CHAT_MODEL = 'qwen3:8b'


class ChatState(TypedDict):
    messages: list


@tool
def add_numbers(a: int, b: int) -> int:
    """Adds a and b.

    Args:
        a: first int
        b: second int
    """
    return a + b


# Augment the LLM with tools
tools = [add_numbers]
tools_by_name = {tool.name: tool for tool in tools}


llm = init_chat_model(CHAT_MODEL, model_provider='ollama')
llm_with_tools = llm.bind_tools(tools)


# Nodes
def llm_node(state: MessagesState):
    """LLM decides whether to call a tool or not"""

    return {
        "messages": [
            llm_with_tools.invoke(
                [
                    SystemMessage(
                        content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
                    )
                ]
                + state["messages"]
            )
        ]
    }


def router(state):
    """Decide if we should continue the loop or stop based upon whether the LLM made a tool call"""

    messages = state["messages"]
    last_message = messages[-1]
    # If the LLM makes a tool call, then perform an action
    if last_message.tool_calls:
        return "Action"
    # Otherwise, we stop (reply to the user)
    return END


def tool_node(state: dict):
    """Performs the tool call"""

    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=observation,
                      tool_call_id=tool_call["id"]))
    return {"messages": result}


builder = StateGraph(MessagesState)
builder.add_node('llm', llm_node)
builder.add_node('tools', tool_node)
builder.add_edge(START, 'llm')
builder.add_conditional_edges('llm', router,  {
    # Name returned by should_continue : Name of next node to visit
    "Action": "tools",
    END: END,
})

builder.add_edge('tools', 'llm')

graph = builder.compile()


if __name__ == '__main__':
    state = {'messages': []}

    print('Type an instruction or "quit".\n')

    while True:
        user_message = input('> ')

        if user_message.lower() == 'quit':
            break

        state['messages'].append(HumanMessage(content=user_message))

        # Show loading message
        print("loading...", end="\r")
        sys.stdout.flush()

        # Call the graph
        state = graph.invoke(state)

        # Clear the loading line
        print(" " * 20, end="\r")

        # Print messages in JSON style
        for m in state['messages']:
            msg_dict = {
                "type": m.__class__.__name__,
                "content": m.content,
                "additional_kwargs": m.additional_kwargs,
                "response_metadata": getattr(m, "response_metadata", None)
            }
            print(json.dumps(msg_dict, indent=2))
