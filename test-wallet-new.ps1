#!/usr/bin/env pwsh
$ErrorActionPreference = 'Continue'

$API_BASE = 'http://localhost:5001/api/v1'

Write-Host "Step 1: Login as company admin..."
try {
  $loginBody = @{
    email = "admin@company1.com"
    password = "Password@123"
  } | ConvertTo-Json

  $loginResponse = Invoke-WebRequest -Uri "$API_BASE/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody `
    -ErrorAction Stop

  $loginData = $loginResponse.Content | ConvertFrom-Json
  $authToken = $loginData.data.token
  Write-Host "Logged in successfully"
} catch {
  Write-Host "Login failed: $($_.Exception.Message)"
  exit 1
}

Write-Host "Step 2: Get employee list..."
try {
  $employeesResponse = Invoke-WebRequest -Uri "$API_BASE/companyAdmins/employees" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $authToken" } `
    -ErrorAction Stop

  $employeesData = $employeesResponse.Content | ConvertFrom-Json
  if ($employeesData.data.Count -gt 0) {
    $employee = $employeesData.data[0]
    $employeeId = $employee.id
    Write-Host "Found employee: $($employee.name) (ID: $employeeId)"
  } else {
    Write-Host "No employees found"
    exit 1
  }
} catch {
  Write-Host "Failed to get employees"
  exit 1
}

Write-Host "Step 3: Add funds to employee wallet..."
try {
  $addFundsBody = @{
    targetType = "employee"
    selectedTarget = $employeeId
    amount = 5000
    walletType = "business"
  } | ConvertTo-Json

  $addFundsResponse = Invoke-WebRequest -Uri "$API_BASE/wallets/add-funds/batch" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $authToken" } `
    -Body $addFundsBody `
    -ErrorAction Stop

  $addFundsData = $addFundsResponse.Content | ConvertFrom-Json
  Write-Host "SUCCESS! Wallet updated"
  Write-Host "Amount: $($addFundsData.data.amount)"
  
} catch {
  Write-Host "ERROR: Failed to add funds"
  exit 1
}
