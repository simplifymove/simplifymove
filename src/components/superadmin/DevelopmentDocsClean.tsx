import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Code,
  Database,
  Server,
  FileCode,
  Terminal,
  CheckCircle2,
  Copy,
  Download,
  BookOpen,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MicroservicesArchitecture } from './MicroservicesArchitecture';

interface DevelopmentDocsCleanProps {
  onBackToHome?: () => void;
}

export function DevelopmentDocsClean({ onBackToHome }: DevelopmentDocsCleanProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Copy code to clipboard
  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Development Documentation</h1>
              <p className="text-gray-600 mt-1">Complete backend setup guide with Java Spring Boot & MySQL</p>
            </div>
            <Button className="bg-[#000035] hover:bg-[#000055]">
              <Download className="w-4 h-4 mr-2" />
              Download Docs
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Technology</p>
                  <p className="text-xl font-bold text-gray-900">Spring Boot</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Code className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Database</p>
                  <p className="text-xl font-bold text-gray-900">MySQL</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Database className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Language</p>
                  <p className="text-xl font-bold text-gray-900">Java 17</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileCode className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Build Tool</p>
                  <p className="text-xl font-bold text-gray-900">Maven</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="microservices" className="data-[state=active]:bg-white">
                Microservices
              </TabsTrigger>
              <TabsTrigger value="setup" className="data-[state=active]:bg-white">
                Setup Guide
              </TabsTrigger>
              <TabsTrigger value="database" className="data-[state=active]:bg-white">
                Database Schema
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-white">
                Code Examples
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-white">
                API Endpoints
              </TabsTrigger>
              <TabsTrigger value="contabo" className="data-[state=active]:bg-white">
                Contabo Server
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SimplifyMove Backend Architecture</h2>
              <p className="text-gray-700 mb-4">
                SimplifyMove is built using a modern microservices architecture with Spring Boot, providing scalable
                and maintainable backend services for travel and logistics management.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Technology Stack</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Java 17 (LTS)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Spring Boot 3.1.x
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Spring Data JPA
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Spring Security (JWT)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      MySQL 8.0+
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Maven Build Tool
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Multi-tenant Architecture
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      RESTful API Design
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      JWT Authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Role-based Access Control
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Transaction Management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Exception Handling
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Project Structure</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`simplifymove-backend/
├── src/
│   ├── main/
│   │   ├── java/com/simplifymove/
│   │   │   ├── config/           # Configuration classes
│   │   │   ├── controller/       # REST Controllers
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── entity/           # JPA Entities
│   │   │   ├── repository/       # JPA Repositories
│   │   │   ├── service/          # Business Logic
│   │   │   ├── security/         # Security & JWT
│   │   │   ├── exception/        # Custom Exceptions
│   │   │   └── util/             # Utility Classes
│   │   └── resources/
│   │       ├── application.yml   # App Configuration
│   │       └── schema.sql        # Database Schema
│   └── test/                     # Unit & Integration Tests
├── pom.xml                       # Maven Dependencies
└── README.md                     # Documentation`}
                </pre>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'microservices' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Microservices Architecture</h2>
              <p className="text-gray-700 mb-4">
                SimplifyMove is designed as a microservices architecture, where each service is a small, independent
                application that communicates with other services through well-defined APIs. This architecture
                enhances scalability, maintainability, and fault isolation.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Core Microservices</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      User Management Service
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Travel Booking Service
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Logistics Booking Service
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Wallet Management Service
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Expense Management Service
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Communication Protocols</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      RESTful APIs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Message Queues (RabbitMQ)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Event Streams (Kafka)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Service Discovery</h3>
                <p className="text-sm text-gray-700">
                  SimplifyMove uses a service discovery mechanism to dynamically locate and communicate with
                  microservices. This is typically achieved using tools like Eureka or Consul.
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'microservices' && (
          <MicroservicesArchitecture />
        )}

        {activeTab === 'setup' && (
          <div className="space-y-6">
            {/* Prerequisites */}
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-[#000035]" />
                <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">1. Install Java Development Kit (JDK) 17</p>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Verify Java installation
java -version

# Should output: java version "17.0.x" or higher`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('java -version', 'Java version check')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">2. Install MySQL 8.0+</p>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Download MySQL from: https://dev.mysql.com/downloads/mysql/

# Start MySQL Server
mysql.server start

# Login to MySQL
mysql -u root -p`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('mysql -u root -p', 'MySQL login')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">3. Install Maven</p>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`# Verify Maven installation
mvn -version

# Should output: Apache Maven 3.8.x or higher`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('mvn -version', 'Maven version check')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </Card>

            {/* Step-by-Step Setup */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Setup</h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#000035] text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <h3 className="font-semibold text-lg">Create MySQL Database</h3>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE simplifymove_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with privileges
CREATE USER 'simplifymove_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON simplifymove_db.* TO 'simplifymove_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify database
SHOW DATABASES;
USE simplifymove_db;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode(`CREATE DATABASE simplifymove_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nCREATE USER 'simplifymove_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';\nGRANT ALL PRIVILEGES ON simplifymove_db.* TO 'simplifymove_user'@'localhost';\nFLUSH PRIVILEGES;`, 'Database setup')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#000035] text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <h3 className="font-semibold text-lg">Create Spring Boot Project</h3>
                  </div>
                  <p className="text-gray-700 mb-3">Visit <a href="https://start.spring.io" className="text-blue-600 underline" target="_blank">start.spring.io</a> and configure:</p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Project:</strong> Maven</li>
                      <li><strong>Language:</strong> Java</li>
                      <li><strong>Spring Boot:</strong> 3.1.x</li>
                      <li><strong>Java:</strong> 17</li>
                      <li><strong>Packaging:</strong> JAR</li>
                      <li><strong>Group:</strong> com.simplifymove</li>
                      <li><strong>Artifact:</strong> backend</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#000035] text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <h3 className="font-semibold text-lg">Add Dependencies (pom.xml)</h3>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- MySQL Connector -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See pom.xml above', 'Dependencies')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                {/* Step 4 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#000035] text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <h3 className="font-semibold text-lg">Configure application.yml</h3>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`spring:
  application:
    name: simplifymove-backend
  
  datasource:
    url: jdbc:mysql://localhost:3306/simplifymove_db?useSSL=false&serverTimezone=UTC
    username: simplifymove_user
    password: SecurePassword123!
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
  
  jackson:
    default-property-inclusion: non_null

server:
  port: 8080
  servlet:
    context-path: /api

# JWT Configuration
jwt:
  secret: SimplifyMoveSecretKeyForJWTTokenGeneration2024
  expiration: 86400000  # 24 hours in milliseconds

# Application Configuration
app:
  name: SimplifyMove
  version: 1.0.0`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See application.yml above', 'Application config')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                {/* Step 5 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#000035] text-white rounded-full flex items-center justify-center font-bold">
                      5
                    </div>
                    <h3 className="font-semibold text-lg">Run the Application</h3>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# Navigate to project directory
cd simplifymove-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Application will start on: http://localhost:8080/api`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('mvn clean install\nmvn spring-boot:run', 'Run commands')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-[#000035]" />
                <h2 className="text-2xl font-bold text-gray-900">Database Schema</h2>
              </div>

              <p className="text-gray-700 mb-4">Complete MySQL database schema for SimplifyMove platform:</p>

              {/* Core Tables */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">1. Companies Table</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_id VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    plan_type ENUM('free', 'basic', 'pro', 'enterprise') DEFAULT 'basic',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    registered_date DATE NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    address TEXT,
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    monthly_budget DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_id (company_id),
    INDEX idx_status (status),
    INDEX idx_plan_type (plan_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See SQL above', 'Companies table')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">2. Users Table</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    company_id BIGINT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50),
    phone VARCHAR(20),
    role ENUM('employee', 'manager', 'admin', 'super_admin') NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    profile_image VARCHAR(500),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_company_id (company_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See SQL above', 'Users table')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">3. Travel Bookings Table</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE travel_bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    booking_type ENUM('flight', 'hotel', 'cab', 'bus', 'bike', 'two_wheeler') NOT NULL,
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    departure_date DATE,
    return_date DATE,
    passengers INT DEFAULT 1,
    class_type VARCHAR(50),
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by BIGINT,
    approval_date TIMESTAMP,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    vendor_name VARCHAR(255),
    vendor_booking_ref VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_status (status),
    INDEX idx_booking_type (booking_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See SQL above', 'Travel bookings table')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">4. Logistics Bookings Table</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE logistics_bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    vehicle_type ENUM('bike', 'three_wheeler', 'mini_truck', 'medium_truck', 'dcm', 'container') NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    delivery_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_date DATE,
    cargo_weight DECIMAL(10, 2),
    cargo_description TEXT,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'approved', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by BIGINT,
    approval_date TIMESTAMP,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    vendor_name VARCHAR(255),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    vehicle_number VARCHAR(50),
    tracking_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See SQL above', 'Logistics bookings table')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">5. Wallet Transactions Table</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE wallet_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    company_id BIGINT NOT NULL,
    transaction_type ENUM('credit', 'debit', 'refund') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    balance_before DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    reference_type ENUM('booking', 'manual', 'subscription', 'refund'),
    reference_id VARCHAR(50),
    processed_by BIGINT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_company_id (company_id),
    INDEX idx_transaction_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See SQL above', 'Wallet transactions table')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">6. Expenses Table</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    expense_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    category ENUM('travel', 'food', 'accommodation', 'fuel', 'misc') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected', 'reimbursed') DEFAULT 'pending',
    approved_by BIGINT,
    approval_date TIMESTAMP,
    reimbursement_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_expense_id (expense_id),
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See SQL above', 'Expenses table')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            {/* Entity Example */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Entity - Company.java</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`package com.simplifymove.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "company_id", unique = true, nullable = false, length = 50)
    private String companyId;
    
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Column(name = "industry", length = 100)
    private String industry;
    
    @Column(name = "company_size", length = 50)
    private String companySize;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type")
    private PlanType planType = PlanType.BASIC;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CompanyStatus status = CompanyStatus.ACTIVE;
    
    @Column(name = "registered_date", nullable = false)
    private LocalDate registeredDate;
    
    @Column(name = "contact_email", nullable = false)
    private String contactEmail;
    
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "wallet_balance", precision = 15, scale = 2)
    private BigDecimal walletBalance = BigDecimal.ZERO;
    
    @Column(name = "monthly_budget", precision = 15, scale = 2)
    private BigDecimal monthlyBudget;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum PlanType {
        FREE, BASIC, PRO, ENTERPRISE
    }
    
    public enum CompanyStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See Company entity above', 'Company entity')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Repository - CompanyRepository.java</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`package com.simplifymove.repository;

import com.simplifymove.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByCompanyId(String companyId);
    
    Optional<Company> findByContactEmail(String email);
    
    List<Company> findByStatus(Company.CompanyStatus status);
    
    List<Company> findByPlanType(Company.PlanType planType);
    
    @Query("SELECT c FROM Company c WHERE c.companyName LIKE %:keyword% OR c.industry LIKE %:keyword%")
    List<Company> searchCompanies(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(c) FROM Company c WHERE c.status = :status")
    long countByStatus(@Param("status") Company.CompanyStatus status);
    
    boolean existsByCompanyId(String companyId);
    
    boolean existsByContactEmail(String email);
}`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See Repository above', 'Repository')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Service - CompanyService.java</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`package com.simplifymove.service;

import com.simplifymove.dto.CompanyDTO;
import com.simplifymove.entity.Company;
import com.simplifymove.exception.ResourceNotFoundException;
import com.simplifymove.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {
    
    private final CompanyRepository companyRepository;
    
    @Transactional
    public CompanyDTO createCompany(CompanyDTO dto) {
        // Generate unique company ID
        String companyId = generateCompanyId();
        
        Company company = Company.builder()
                .companyId(companyId)
                .companyName(dto.getCompanyName())
                .industry(dto.getIndustry())
                .companySize(dto.getCompanySize())
                .planType(Company.PlanType.valueOf(dto.getPlanType()))
                .status(Company.CompanyStatus.ACTIVE)
                .registeredDate(LocalDate.now())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .address(dto.getAddress())
                .build();
        
        Company saved = companyRepository.save(company);
        return mapToDTO(saved);
    }
    
    public CompanyDTO getCompanyById(String companyId) {
        Company company = companyRepository.findByCompanyId(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
        return mapToDTO(company);
    }
    
    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CompanyDTO updateCompany(String companyId, CompanyDTO dto) {
        Company company = companyRepository.findByCompanyId(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
        
        company.setCompanyName(dto.getCompanyName());
        company.setIndustry(dto.getIndustry());
        company.setContactEmail(dto.getContactEmail());
        company.setContactPhone(dto.getContactPhone());
        company.setAddress(dto.getAddress());
        
        Company updated = companyRepository.save(company);
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteCompany(String companyId) {
        Company company = companyRepository.findByCompanyId(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
        companyRepository.delete(company);
    }
    
    private String generateCompanyId() {
        long count = companyRepository.count() + 1;
        return "COMP-" + String.format("%03d", count);
    }
    
    private CompanyDTO mapToDTO(Company company) {
        return CompanyDTO.builder()
                .companyId(company.getCompanyId())
                .companyName(company.getCompanyName())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .planType(company.getPlanType().name())
                .status(company.getStatus().name())
                .contactEmail(company.getContactEmail())
                .contactPhone(company.getContactPhone())
                .address(company.getAddress())
                .registeredDate(company.getRegisteredDate().toString())
                .build();
    }
}`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See Service above', 'Service')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Controller - CompanyController.java</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`package com.simplifymove.controller;

import com.simplifymove.dto.CompanyDTO;
import com.simplifymove.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {
    
    private final CompanyService companyService;
    
    @PostMapping
    public ResponseEntity<CompanyDTO> createCompany(@Valid @RequestBody CompanyDTO dto) {
        CompanyDTO created = companyService.createCompany(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyDTO> getCompany(@PathVariable String companyId) {
        CompanyDTO company = companyService.getCompanyById(companyId);
        return ResponseEntity.ok(company);
    }
    
    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        List<CompanyDTO> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
    
    @PutMapping("/{companyId}")
    public ResponseEntity<CompanyDTO> updateCompany(
            @PathVariable String companyId,
            @Valid @RequestBody CompanyDTO dto) {
        CompanyDTO updated = companyService.updateCompany(companyId, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteCompany(@PathVariable String companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.noContent().build();
    }
}`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See Controller above', 'Controller')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">DTO - CompanyDTO.java</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`package com.simplifymove.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDTO {
    
    private String companyId;
    
    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 255, message = "Company name must be between 2 and 255 characters")
    private String companyName;
    
    private String industry;
    private String companySize;
    private String planType;
    private String status;
    
    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String contactPhone;
    
    private String address;
    private String registeredDate;
}`}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCopyCode('See DTO above', 'DTO')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints Documentation</h2>
              
              <div className="space-y-6">
                {/* Companies API */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Companies API</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-600">POST</Badge>
                        <code className="text-sm">/api/companies</code>
                      </div>
                      <p className="text-sm text-gray-700">Create a new company</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600">GET</Badge>
                        <code className="text-sm">/api/companies</code>
                      </div>
                      <p className="text-sm text-gray-700">Get all companies</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600">GET</Badge>
                        <code className="text-sm">/api/companies/{'{companyId}'}</code>
                      </div>
                      <p className="text-sm text-gray-700">Get company by ID</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-600">PUT</Badge>
                        <code className="text-sm">/api/companies/{'{companyId}'}</code>
                      </div>
                      <p className="text-sm text-gray-700">Update company</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-600">DELETE</Badge>
                        <code className="text-sm">/api/companies/{'{companyId}'}</code>
                      </div>
                      <p className="text-sm text-gray-700">Delete company</p>
                    </div>
                  </div>
                </div>

                {/* Users API */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Users API</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-600">POST</Badge>
                        <code className="text-sm">/api/users/register</code>
                      </div>
                      <p className="text-sm text-gray-700">Register new user</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-600">POST</Badge>
                        <code className="text-sm">/api/users/login</code>
                      </div>
                      <p className="text-sm text-gray-700">User authentication (returns JWT token)</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600">GET</Badge>
                        <code className="text-sm">/api/users/{'{userId}'}</code>
                      </div>
                      <p className="text-sm text-gray-700">Get user profile</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600">GET</Badge>
                        <code className="text-sm">/api/users/company/{'{companyId}'}</code>
                      </div>
                      <p className="text-sm text-gray-700">Get all users by company</p>
                    </div>
                  </div>
                </div>

                {/* Bookings API */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Travel Bookings API</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-600">POST</Badge>
                        <code className="text-sm">/api/bookings/travel</code>
                      </div>
                      <p className="text-sm text-gray-700">Create travel booking</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600">GET</Badge>
                        <code className="text-sm">/api/bookings/travel/user/{'{userId}'}</code>
                      </div>
                      <p className="text-sm text-gray-700">Get user's bookings</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-600">PUT</Badge>
                        <code className="text-sm">/api/bookings/travel/{'{bookingId}'}/approve</code>
                      </div>
                      <p className="text-sm text-gray-700">Approve booking</p>
                    </div>
                  </div>
                </div>

                {/* Sample Request/Response */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Sample Request & Response</h3>
                  <p className="text-sm text-gray-700 mb-2">POST /api/companies</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Request Body:</p>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`{
  "companyName": "Tech Innovations Ltd",
  "industry": "Technology",
  "companySize": "150",
  "planType": "ENTERPRISE",
  "contactEmail": "admin@techinnovations.com",
  "contactPhone": "9876543210",
  "address": "123 Tech Park, Bangalore"
}`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Response (201 Created):</p>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`{
  "companyId": "COMP-001",
  "companyName": "Tech Innovations Ltd",
  "industry": "Technology",
  "companySize": "150",
  "planType": "ENTERPRISE",
  "status": "ACTIVE",
  "contactEmail": "admin@techinnovations.com",
  "contactPhone": "9876543210",
  "address": "123 Tech Park, Bangalore",
  "registeredDate": "2024-12-24"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contabo' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Contabo VPS Server Configuration</h2>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Cost-Optimized</Badge>
              </div>
              <p className="text-gray-700 mb-6">
                Complete end-to-end manual server setup guide for deploying SimplifyMove on Contabo VPS 
                to reduce hosting costs while maintaining performance and reliability.
              </p>

              {/* Server Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  Recommended Server Specifications
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Minimum Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>RAM:</strong> 8 GB
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>CPU:</strong> 4 vCores
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>Storage:</strong> 200 GB SSD
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>Bandwidth:</strong> Unlimited
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>OS:</strong> Ubuntu 22.04 LTS
                      </li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Recommended (Production)</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>RAM:</strong> 16 GB
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>CPU:</strong> 6 vCores
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>Storage:</strong> 400 GB NVMe SSD
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>Bandwidth:</strong> Unlimited
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <strong>OS:</strong> Ubuntu 22.04 LTS
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 1: Initial Server Setup */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-green-600" />
                  Step 1: Initial Server Setup & Security
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">1.1 Connect to Your Server</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode('ssh root@your-server-ip', 'SSH Command')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>ssh root@your-server-ip</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">1.2 Update System Packages</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`apt update && apt upgrade -y
apt install ufw fail2ban -y`, 'Update Command')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`apt update && apt upgrade -y
apt install ufw fail2ban -y`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">1.3 Create Non-Root User</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`adduser simplifymove
usermod -aG sudo simplifymove
su - simplifymove`, 'User Creation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`adduser simplifymove
usermod -aG sudo simplifymove
su - simplifymove`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">1.4 Configure Firewall</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`ufw allow OpenSSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8080/tcp  # Spring Boot
ufw allow 3306/tcp  # MySQL (localhost only recommended)
ufw enable
ufw status`, 'Firewall Setup')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`ufw allow OpenSSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8080/tcp  # Spring Boot
ufw allow 3306/tcp  # MySQL (localhost only recommended)
ufw enable
ufw status`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Install Required Software */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  Step 2: Install Required Software Stack
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">2.1 Install Java 17 (OpenJDK)</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo apt install openjdk-17-jdk -y
java -version
echo "JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" | sudo tee -a /etc/environment
source /etc/environment`, 'Java Installation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo apt install openjdk-17-jdk -y
java -version
echo "JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" | sudo tee -a /etc/environment
source /etc/environment`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">2.2 Install MySQL 8.0</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation`, 'MySQL Installation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation`}</pre>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      ⚠️ During mysql_secure_installation: Set strong root password, remove anonymous users, 
                      disallow root login remotely, remove test database.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">2.3 Install Maven</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo apt install maven -y
mvn -version`, 'Maven Installation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo apt install maven -y
mvn -version`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">2.4 Install Nginx (Reverse Proxy)</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx`, 'Nginx Installation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">2.5 Install Git</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo apt install git -y
git --version`, 'Git Installation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo apt install git -y
git --version`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Database Setup */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Step 3: MySQL Database Configuration
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">3.1 Create Database and User</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo mysql -u root -p

-- In MySQL prompt:
CREATE DATABASE simplifymove_db;
CREATE USER 'simplifymove_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON simplifymove_db.* TO 'simplifymove_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;`, 'Database Setup')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo mysql -u root -p

-- In MySQL prompt:
CREATE DATABASE simplifymove_db;
CREATE USER 'simplifymove_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON simplifymove_db.* TO 'simplifymove_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">3.2 Optimize MySQL Configuration</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add these optimizations:
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
query_cache_size = 32M
query_cache_type = 1

# Save and restart
sudo systemctl restart mysql`, 'MySQL Optimization')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add these optimizations:
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
query_cache_size = 32M
query_cache_type = 1

# Save and restart
sudo systemctl restart mysql`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Application Deployment */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Step 4: Deploy Spring Boot Application
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">4.1 Create Application Directory</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo mkdir -p /opt/simplifymove
sudo chown -R simplifymove:simplifymove /opt/simplifymove
cd /opt/simplifymove`, 'Create Directory')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo mkdir -p /opt/simplifymove
sudo chown -R simplifymove:simplifymove /opt/simplifymove
cd /opt/simplifymove`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">4.2 Clone Repository (If using Git)</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`git clone https://github.com/yourusername/simplifymove-backend.git
cd simplifymove-backend`, 'Clone Repository')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`git clone https://github.com/yourusername/simplifymove-backend.git
cd simplifymove-backend`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">4.3 Configure application.properties</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`nano src/main/resources/application.properties

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/simplifymove_db
spring.datasource.username=simplifymove_user
spring.datasource.password=YourStrongPassword123!
spring.jpa.hibernate.ddl-auto=update

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.root=INFO
logging.file.name=/opt/simplifymove/logs/application.log`, 'Application Properties')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`nano src/main/resources/application.properties

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/simplifymove_db
spring.datasource.username=simplifymove_user
spring.datasource.password=YourStrongPassword123!
spring.jpa.hibernate.ddl-auto=update

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.root=INFO
logging.file.name=/opt/simplifymove/logs/application.log`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">4.4 Build Application</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`mvn clean package -DskipTests
# JAR file will be in target/ directory`, 'Build Application')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`mvn clean package -DskipTests
# JAR file will be in target/ directory`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Systemd Service */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-red-600" />
                  Step 5: Create Systemd Service (Auto-start on Boot)
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">5.1 Create Service File</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo nano /etc/systemd/system/simplifymove.service

[Unit]
Description=SimplifyMove Spring Boot Application
After=syslog.target mysql.service

[Service]
User=simplifymove
ExecStart=/usr/bin/java -jar /opt/simplifymove/simplifymove-backend/target/simplifymove-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`, 'Systemd Service')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo nano /etc/systemd/system/simplifymove.service

[Unit]
Description=SimplifyMove Spring Boot Application
After=syslog.target mysql.service

[Service]
User=simplifymove
ExecStart=/usr/bin/java -jar /opt/simplifymove/simplifymove-backend/target/simplifymove-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">5.2 Enable and Start Service</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo systemctl daemon-reload
sudo systemctl enable simplifymove
sudo systemctl start simplifymove
sudo systemctl status simplifymove`, 'Start Service')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo systemctl daemon-reload
sudo systemctl enable simplifymove
sudo systemctl start simplifymove
sudo systemctl status simplifymove`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">5.3 View Application Logs</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo journalctl -u simplifymove -f`, 'View Logs')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo journalctl -u simplifymove -f`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6: Nginx Configuration */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-600" />
                  Step 6: Configure Nginx Reverse Proxy
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">6.1 Create Nginx Configuration</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo nano /etc/nginx/sites-available/simplifymove

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/simplifymove;
        try_files $uri $uri/ /index.html;
    }
}`, 'Nginx Configuration')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo nano /etc/nginx/sites-available/simplifymove

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/simplifymove;
        try_files $uri $uri/ /index.html;
    }
}`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">6.2 Enable Site and Restart Nginx</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo ln -s /etc/nginx/sites-available/simplifymove /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`, 'Enable Nginx')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo ln -s /etc/nginx/sites-available/simplifymove /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 7: SSL Certificate */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Step 7: Install SSL Certificate (Let's Encrypt - Free)
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">7.1 Install Certbot</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo apt install certbot python3-certbot-nginx -y`, 'Install Certbot')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo apt install certbot python3-certbot-nginx -y`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">7.2 Obtain SSL Certificate</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo certbot --nginx -d your-domain.com -d www.your-domain.com`, 'Get SSL')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo certbot --nginx -d your-domain.com -d www.your-domain.com`}</pre>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      ✅ Certificate will auto-renew. Test renewal: <code className="bg-gray-200 px-2 py-1 rounded">sudo certbot renew --dry-run</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 8: Monitoring & Maintenance */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-600" />
                  Step 8: Monitoring & Maintenance
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">8.1 Setup Log Rotation</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`sudo nano /etc/logrotate.d/simplifymove

/opt/simplifymove/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 simplifymove simplifymove
    sharedscripts
}`, 'Log Rotation')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`sudo nano /etc/logrotate.d/simplifymove

/opt/simplifymove/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 simplifymove simplifymove
    sharedscripts
}`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">8.2 Automated Backup Script</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`nano /home/simplifymove/backup.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u simplifymove_user -pYourStrongPassword123! simplifymove_db > $BACKUP_DIR/db_$DATE.sql
gzip $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

chmod +x /home/simplifymove/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/simplifymove/backup.sh`, 'Backup Script')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`nano /home/simplifymove/backup.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u simplifymove_user -pYourStrongPassword123! simplifymove_db > $BACKUP_DIR/db_$DATE.sql
gzip $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

chmod +x /home/simplifymove/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/simplifymove/backup.sh`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">8.3 System Monitoring Commands</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`# Check CPU & Memory
htop

# Check Disk Space
df -h

# Check Application Status
sudo systemctl status simplifymove

# Check Nginx Status
sudo systemctl status nginx

# Check MySQL Status
sudo systemctl status mysql

# View Application Logs
sudo journalctl -u simplifymove -n 100 --no-pager

# Check Server Uptime
uptime`, 'Monitoring Commands')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`# Check CPU & Memory
htop

# Check Disk Space
df -h

# Check Application Status
sudo systemctl status simplifymove

# Check Nginx Status
sudo systemctl status nginx

# Check MySQL Status
sudo systemctl status mysql

# View Application Logs
sudo journalctl -u simplifymove -n 100 --no-pager

# Check Server Uptime
uptime`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 9: Frontend Deployment */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Step 9: Deploy React Frontend
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">9.1 Install Node.js & npm</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
node --version
npm --version`, 'Install Node.js')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
node --version
npm --version`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">9.2 Build & Deploy Frontend</p>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(`# Clone frontend repository
cd /opt/simplifymove
git clone https://github.com/yourusername/simplifymove-frontend.git

cd simplifymove-frontend
npm install
npm run build

# Copy build to Nginx directory
sudo mkdir -p /var/www/simplifymove
sudo cp -r dist/* /var/www/simplifymove/
sudo chown -R www-data:www-data /var/www/simplifymove`, 'Frontend Deployment')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre>{`# Clone frontend repository
cd /opt/simplifymove
git clone https://github.com/yourusername/simplifymove-frontend.git

cd simplifymove-frontend
npm install
npm run build

# Copy build to Nginx directory
sudo mkdir -p /var/www/simplifymove
sudo cp -r dist/* /var/www/simplifymove/
sudo chown -R www-data:www-data /var/www/simplifymove`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Optimization Tips */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">💰</Badge>
                  Cost Optimization Tips
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Monthly Cost Breakdown
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li><strong>VPS (8GB RAM):</strong> ~€8-12/month</li>
                      <li><strong>VPS (16GB RAM):</strong> ~€15-20/month</li>
                      <li><strong>Domain:</strong> €10-15/year</li>
                      <li><strong>SSL:</strong> FREE (Let's Encrypt)</li>
                      <li className="pt-2 border-t border-green-300 font-semibold">
                        Total: €10-25/month
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Optimization Strategies</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        Use connection pooling in Spring Boot
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        Enable MySQL query cache
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        Compress static assets in Nginx
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        Setup Redis for caching (optional)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        Monitor resource usage regularly
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🔧 Common Troubleshooting</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900">Application won't start?</p>
                    <p>Check logs: <code className="bg-gray-200 px-2 py-1 rounded">sudo journalctl -u simplifymove -n 50</code></p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Database connection failed?</p>
                    <p>Verify credentials in application.properties and test: <code className="bg-gray-200 px-2 py-1 rounded">mysql -u simplifymove_user -p</code></p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Nginx showing 502 Bad Gateway?</p>
                    <p>Check if Spring Boot is running: <code className="bg-gray-200 px-2 py-1 rounded">systemctl status simplifymove</code></p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Out of memory errors?</p>
                    <p>Increase JVM heap: Add <code className="bg-gray-200 px-2 py-1 rounded">-Xmx2G</code> to ExecStart in service file</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}