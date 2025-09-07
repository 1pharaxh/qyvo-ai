import os
import json
from typing import TypedDict

from dotenv import load_dotenv

from langchain.chat_models import init_chat_model
from langchain_core.tools import tool

from langgraph.prebuilt import ToolNode
from langgraph.graph import StateGraph, START, END

load_dotenv()


CHAT_MODEL = 'qwen3:8b'


class ChatState(TypedDict):
    messages: list


@tool
def add_numbers(a: int, b: int) -> int:
    """return sum of two numbers"""
    response = a + b
    return response


llm = init_chat_model(CHAT_MODEL, model_provider='ollama')
llm = llm.bind_tools([add_numbers])

raw_llm = init_chat_model(CHAT_MODEL, model_provider='ollama')


def llm_node(state):
    response = llm.invoke(state['messages'])
    return {'messages': state['messages'] + [response]}


def router(state):
    last_message = state['messages'][-1]
    return 'tools' if getattr(last_message, 'tool_calls', None) else 'end'


tool_node = ToolNode([add_numbers])


def tools_node(state):
    print("🔧 Executing tools...")
    result = tool_node.invoke(state)

    # Print tool results
    for message in result['messages']:
        if hasattr(message, 'content'):
            print(f"Tool result: {message.content}")

    return {
        'messages': state['messages'] + result['messages']
    }


builder = StateGraph(ChatState)
builder.add_node('llm', llm_node)
builder.add_node('tools', tools_node)
builder.add_edge(START, 'llm')
builder.add_edge('tools', 'llm')
builder.add_conditional_edges('llm', router, {'tools': 'tools', 'end': END})

graph = builder.compile()


if __name__ == '__main__':
    state = {'messages': []}

    print('Type an instruction or "quit".\n')

    while True:
        user_message = input('> ')

        if user_message.lower() == 'quit':
            break

        state['messages'].append({'role': 'user', 'content': user_message})

        state = graph.invoke(state)

        print(state['messages'][-1].content, '\n')
