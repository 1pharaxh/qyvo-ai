# main.spec
# PyInstaller spec file for LangGraph + Ollama console app

block_cipher = None

a = Analysis(
    ['main.py'],              # your entrypoint file
    pathex=[],
    binaries=[],
    datas=[
        ('.env', '.'),        # include your .env file if needed
    ],
    hiddenimports=[
        'langchain_core.messages',
        'langgraph',
        'dotenv',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='chat_agent',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,   # console=True so you can type > prompts
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='chat_agent'
)
