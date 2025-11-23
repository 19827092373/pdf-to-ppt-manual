; Inno Setup安装脚本
; 需要先安装Inno Setup: https://jrsoftware.org/isdl.php

[Setup]
AppName=PDF习题拆分PPT工具
AppVersion=1.0
DefaultDirName={pf}\PDF习题拆分工具
DefaultGroupName=PDF习题拆分工具
OutputDir=安装包
OutputBaseFilename=PDF习题拆分工具_安装程序
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
LicenseFile=
InfoBeforeFile=
InfoAfterFile=

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加图标:"
Name: "quicklaunchicon"; Description: "创建快速启动栏快捷方式"; GroupDescription: "附加图标:"; Flags: unchecked

[Files]
Source: "app.py"; DestDir: "{app}"; Flags: ignoreversion
Source: "requirements.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "templates\*"; DestDir: "{app}\templates"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "static\*"; DestDir: "{app}\static"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "utils\*"; DestDir: "{app}\utils"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\PDF习题拆分工具"; Filename: "{app}\run.bat"; WorkingDir: "{app}"
Name: "{group}\卸载"; Filename: "{uninstallexe}"
Name: "{commondesktop}\PDF习题拆分工具"; Filename: "{app}\run.bat"; WorkingDir: "{app}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\PDF习题拆分工具"; Filename: "{app}\run.bat"; WorkingDir: "{app}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\安装依赖.bat"; Description: "安装Python依赖"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
  // 检查Python是否安装
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\Python\PythonCore\3.11\InstallPath', '', PythonPath) then
  begin
    if not RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\Python\PythonCore\3.10\InstallPath', '', PythonPath) then
    begin
      if not RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\Python\PythonCore\3.9\InstallPath', '', PythonPath) then
      begin
        MsgBox('未检测到Python安装，请先安装Python 3.7或更高版本', mbError, MB_OK);
        Result := False;
      end;
    end;
  end;
end;

