
# OlimpoFitness - Inicio automatico del backend

$ErrorActionPreference = "Stop"

# Carpeta donde guardamos las credenciales
$carpeta = Join-Path $env:LOCALAPPDATA "OlimpoFitness"

# Recuperar credenciales de MariaDB
$db = Import-Clixml (Join-Path $carpeta "database.xml")

$env:DB_PASSWORD = $db.GetNetworkCredential().Password

# Recuperar clave secreta JWT
$jwtSeguro = Import-Clixml (Join-Path $carpeta "jwt.xml")

$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($jwtSeguro)

try {
    $env:JWT_SECRET = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}

# Entrar a la carpeta del script
Set-Location $PSScriptRoot

# Iniciar Spring Boot
Write-Host "Iniciando OlimpoFitness Backend..."

& ".\mvnw.cmd" spring-boot:run

# Limpiar las variables al finalizar
Remove-Item Env:\DB_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:\JWT_SECRET -ErrorAction SilentlyContinue
