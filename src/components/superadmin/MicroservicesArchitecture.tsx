import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Server,
  Database,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export function MicroservicesArchitecture() {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card className="p-6 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Microservices & Nanoservices Architecture</h2>
        <p className="text-gray-700 mb-4">
          SimplifyMove follows a modern microservices architecture pattern where the platform is decomposed into
          loosely coupled, independently deployable services. This architecture provides scalability, fault isolation,
          and technology flexibility.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">15 Microservices</h3>
            </div>
            <p className="text-sm text-gray-600">Core business logic services</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">8 Nanoservices</h3>
            </div>
            <p className="text-sm text-gray-600">Specialized utility services</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Database per Service</h3>
            </div>
            <p className="text-sm text-gray-600">Isolated data storage</p>
          </div>
        </div>
      </Card>

      {/* Core Microservices */}
      <Card className="p-6 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Microservices (15 Services)</h2>
        <div className="space-y-4">
          {/* Service 1 */}
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Authentication & Authorization Service</h3>
                  <Badge className="bg-blue-100 text-blue-700 mt-1">auth-service</Badge>
                </div>
              </div>
              <Badge className="bg-green-600">Critical</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Handles user authentication, JWT token management, role-based access control (RBAC), 
              session management, and OAuth2 integration.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Security, JWT, OAuth2, Redis</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (users, roles, permissions)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• User login/logout with JWT token generation</li>
                <li>• Multi-factor authentication (MFA)</li>
                <li>• Role-based permissions (Employee, Manager, Admin, Super Admin)</li>
                <li>• Session management & token refresh</li>
              </ul>
            </div>
          </div>

          {/* Service 2 */}
          <div className="bg-green-50 p-5 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">User Management Service</h3>
                  <Badge className="bg-green-100 text-green-700 mt-1">user-service</Badge>
                </div>
              </div>
              <Badge className="bg-green-600">Critical</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages user profiles, employee details, company assignments, department structure, 
              and user preferences across all three portals.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, JPA, Hibernate</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (users, profiles, departments)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• User CRUD operations (Create, Read, Update, Delete)</li>
                <li>• Profile management with avatar uploads</li>
                <li>• Department and team assignments</li>
                <li>• Employee hierarchy management</li>
              </ul>
            </div>
          </div>

          {/* Service 3 */}
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Company Management Service</h3>
                  <Badge className="bg-purple-100 text-purple-700 mt-1">company-service</Badge>
                </div>
              </div>
              <Badge className="bg-green-600">Critical</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Handles multi-tenant company operations, company onboarding, subscription plans, 
              company settings, and organizational structure.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, Multi-tenancy support</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (companies, subscriptions)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Company registration and onboarding</li>
                <li>• Subscription plan management (Free, Basic, Pro, Enterprise)</li>
                <li>• Company settings and configuration</li>
                <li>• Multi-tenant data isolation</li>
              </ul>
            </div>
          </div>

          {/* Service 4 */}
          <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Travel Booking Service</h3>
                  <Badge className="bg-orange-100 text-orange-700 mt-1">travel-booking-service</Badge>
                </div>
              </div>
              <Badge className="bg-yellow-600">High</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages all travel booking operations including flights, hotels, cabs, buses, bikes, 
              and two-wheelers with vendor integration and fare calculation.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, REST APIs, Kafka</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (bookings, itineraries)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Multi-mode travel booking (Flight, Hotel, Cab, Bus, Bike)</li>
                <li>• Real-time availability checking</li>
                <li>• Dynamic pricing and fare calculation</li>
                <li>• Booking status tracking (Pending, Confirmed, Cancelled)</li>
              </ul>
            </div>
          </div>

          {/* Service 5 */}
          <div className="bg-pink-50 p-5 rounded-lg border border-pink-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Logistics Booking Service</h3>
                  <Badge className="bg-pink-100 text-pink-700 mt-1">logistics-booking-service</Badge>
                </div>
              </div>
              <Badge className="bg-yellow-600">High</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Handles logistics booking for goods transportation including bikes, auto, 
              mini trucks, medium trucks, DCM, and containers.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, GPS Integration, Kafka</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (logistics bookings, tracking)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Vehicle-based booking (6 vehicle types)</li>
                <li>• Real-time GPS tracking</li>
                <li>• Weight and dimension-based pricing</li>
                <li>• Delivery status updates</li>
              </ul>
            </div>
          </div>

          {/* Service 6 */}
          <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Approval Workflow Service</h3>
                  <Badge className="bg-indigo-100 text-indigo-700 mt-1">approval-service</Badge>
                </div>
              </div>
              <Badge className="bg-yellow-600">High</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages multi-level approval workflows for bookings, expenses, and policies 
              with configurable rules and notification triggers.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, Rule Engine, RabbitMQ</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (approvals, workflow rules)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Multi-level approval chains (L1, L2, L3)</li>
                <li>• Rule-based auto-approval</li>
                <li>• Approval delegation and escalation</li>
                <li>• Real-time approval notifications</li>
              </ul>
            </div>
          </div>

          {/* Service 7 */}
          <div className="bg-teal-50 p-5 rounded-lg border border-teal-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold">
                  7
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Wallet & Payment Service</h3>
                  <Badge className="bg-teal-100 text-teal-700 mt-1">wallet-service</Badge>
                </div>
              </div>
              <Badge className="bg-green-600">Critical</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages company wallets, transactions, payment processing, credit/debit operations, 
              and payment gateway integration.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, Razorpay, Stripe</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (transactions, wallet balances)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Company wallet with INR balance</li>
                <li>• Credit/Debit transaction management</li>
                <li>• Payment gateway integration (Razorpay, Stripe)</li>
                <li>• Transaction history and audit trail</li>
              </ul>
            </div>
          </div>

          {/* Service 8 */}
          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600 text-white rounded-lg flex items-center justify-center font-bold">
                  8
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Expense Management Service</h3>
                  <Badge className="bg-yellow-100 text-yellow-700 mt-1">expense-service</Badge>
                </div>
              </div>
              <Badge className="bg-yellow-600">High</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Handles expense claims, receipt uploads, reimbursement processing, 
              and expense policy validation.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, OCR (Tesseract), S3</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (expenses, receipts)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Expense claim submission with receipts</li>
                <li>• OCR-based receipt scanning</li>
                <li>• Policy-based validation</li>
                <li>• Reimbursement processing</li>
              </ul>
            </div>
          </div>

          {/* Service 9 */}
          <div className="bg-red-50 p-5 rounded-lg border border-red-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                  9
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Policy Management Service</h3>
                  <Badge className="bg-red-100 text-red-700 mt-1">policy-service</Badge>
                </div>
              </div>
              <Badge className="bg-yellow-600">High</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages travel policies, expense policies, booking rules, approval rules, 
              and policy templates for companies.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, Rule Engine</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (policies, rules, templates)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Travel policy configuration (cab class, flight class)</li>
                <li>• Expense policy limits</li>
                <li>• Global policy templates (Super Admin)</li>
                <li>• Policy versioning and audit</li>
              </ul>
            </div>
          </div>

          {/* Service 10 */}
          <div className="bg-cyan-50 p-5 rounded-lg border border-cyan-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-600 text-white rounded-lg flex items-center justify-center font-bold">
                  10
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Vendor Management Service</h3>
                  <Badge className="bg-cyan-100 text-cyan-700 mt-1">vendor-service</Badge>
                </div>
              </div>
              <Badge className="bg-orange-600">Medium</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Handles vendor registration, API integrations, vendor ratings, 
              performance tracking, and vendor payouts.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, REST APIs</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (vendors, integrations)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Vendor onboarding and KYC verification</li>
                <li>• API key management for integrations</li>
                <li>• Performance metrics and ratings</li>
                <li>• Automated vendor payouts</li>
              </ul>
            </div>
          </div>

          {/* Service 11 */}
          <div className="bg-lime-50 p-5 rounded-lg border border-lime-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-lime-600 text-white rounded-lg flex items-center justify-center font-bold">
                  11
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Analytics & Reporting Service</h3>
                  <Badge className="bg-lime-100 text-lime-700 mt-1">analytics-service</Badge>
                </div>
              </div>
              <Badge className="bg-orange-600">Medium</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Generates analytics dashboards, reports, spending insights, 
              booking trends, and export capabilities.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, Apache POI, JasperReports</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL + MongoDB (analytics data)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Real-time analytics dashboards</li>
                <li>• Custom report generation (PDF, Excel, CSV)</li>
                <li>• Spending analysis and trends</li>
                <li>• Department-wise booking insights</li>
              </ul>
            </div>
          </div>

          {/* Service 12 */}
          <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 text-white rounded-lg flex items-center justify-center font-bold">
                  12
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Audit & Logging Service</h3>
                  <Badge className="bg-amber-100 text-amber-700 mt-1">audit-service</Badge>
                </div>
              </div>
              <Badge className="bg-orange-600">Medium</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Tracks all platform activities, maintains audit trails, 
              compliance logs, and security events.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, ELK Stack, Kafka</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">Elasticsearch (logs), MongoDB</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Comprehensive activity logging</li>
                <li>• Audit trail for all CRUD operations</li>
                <li>• Security event monitoring</li>
                <li>• Searchable log indexing</li>
              </ul>
            </div>
          </div>

          {/* Service 13 */}
          <div className="bg-rose-50 p-5 rounded-lg border border-rose-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-600 text-white rounded-lg flex items-center justify-center font-bold">
                  13
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Support & Ticketing Service</h3>
                  <Badge className="bg-rose-100 text-rose-700 mt-1">support-service</Badge>
                </div>
              </div>
              <Badge className="bg-orange-600">Medium</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages customer support tickets, helpdesk operations, 
              internal queries, and FAQ management.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, WebSocket, Zendesk API</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (tickets, conversations)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ticket creation and assignment</li>
                <li>• Priority-based ticket management</li>
                <li>• Real-time chat support</li>
                <li>• FAQ and knowledge base</li>
              </ul>
            </div>
          </div>

          {/* Service 14 */}
          <div className="bg-violet-50 p-5 rounded-lg border border-violet-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 text-white rounded-lg flex items-center justify-center font-bold">
                  14
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Subscription & Billing Service</h3>
                  <Badge className="bg-violet-100 text-violet-700 mt-1">subscription-service</Badge>
                </div>
              </div>
              <Badge className="bg-orange-600">Medium</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Manages company subscriptions, plan upgrades/downgrades, 
              invoice generation, and recurring billing.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Boot, Quartz Scheduler</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (subscriptions, invoices)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Plan management (Free, Basic, Pro, Enterprise)</li>
                <li>• Automated recurring billing</li>
                <li>• Invoice generation (PDF)</li>
                <li>• Subscription renewal reminders</li>
              </ul>
            </div>
          </div>

          {/* Service 15 */}
          <div className="bg-sky-50 p-5 rounded-lg border border-sky-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-600 text-white rounded-lg flex items-center justify-center font-bold">
                  15
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">System Configuration Service</h3>
                  <Badge className="bg-sky-100 text-sky-700 mt-1">config-service</Badge>
                </div>
              </div>
              <Badge className="bg-orange-600">Medium</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Purpose:</strong> Centralized configuration management, feature flags, 
              environment variables, and system parameters.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack</p>
                <p className="text-sm">Spring Cloud Config, Consul</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Database</p>
                <p className="text-sm">MySQL (configurations), Redis (cache)</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Key Features</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Centralized config management</li>
                <li>• Feature flag toggles</li>
                <li>• Dynamic configuration updates</li>
                <li>• Environment-specific settings</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Nanoservices */}
      <Card className="p-6 border-gray-200 bg-gradient-to-br from-green-50 to-teal-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nanoservices / Utility Services (8 Services)</h2>
        <p className="text-sm text-gray-700 mb-4">
          Nanoservices are lightweight, single-purpose services that handle specific technical functions. 
          They are highly focused and can be independently scaled.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nanoservice 1 */}
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notification Service</h3>
                <Badge className="bg-green-100 text-green-700 text-xs">notification-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Handles email, SMS, push notifications, and in-app notifications.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Spring Boot, Twilio, SendGrid, Firebase Cloud Messaging
            </p>
          </div>

          {/* Nanoservice 2 */}
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">File Storage Service</h3>
                <Badge className="bg-blue-100 text-blue-700 text-xs">storage-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Manages file uploads, storage, and retrieval (receipts, documents, avatars).
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Spring Boot, AWS S3, MinIO, CloudFront CDN
            </p>
          </div>

          {/* Nanoservice 3 */}
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Service</h3>
                <Badge className="bg-purple-100 text-purple-700 text-xs">email-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Dedicated email sending with templates, scheduling, and delivery tracking.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Spring Boot, SendGrid, Mailgun, SMTP
            </p>
          </div>

          {/* Nanoservice 4 */}
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SMS Service</h3>
                <Badge className="bg-orange-100 text-orange-700 text-xs">sms-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Sends SMS notifications for OTP, booking confirmations, and alerts.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Spring Boot, Twilio, AWS SNS, MSG91
            </p>
          </div>

          {/* Nanoservice 5 */}
          <div className="bg-white p-4 rounded-lg border border-pink-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Currency & Localization Service</h3>
                <Badge className="bg-pink-100 text-pink-700 text-xs">localization-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Handles INR currency formatting, date/time localization, and multi-language support.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Spring Boot, ICU4J, Locale Management
            </p>
          </div>

          {/* Nanoservice 6 */}
          <div className="bg-white p-4 rounded-lg border border-teal-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N6
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Caching Service</h3>
                <Badge className="bg-teal-100 text-teal-700 text-xs">cache-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Distributed caching for frequently accessed data to improve performance.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Redis, Spring Cache, Caffeine
            </p>
          </div>

          {/* Nanoservice 7 */}
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-yellow-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N7
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search Service</h3>
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">search-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Full-text search across bookings, users, companies, and documents.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Elasticsearch, Apache Solr
            </p>
          </div>

          {/* Nanoservice 8 */}
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                N8
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rate Limiting Service</h3>
                <Badge className="bg-indigo-100 text-indigo-700 text-xs">rate-limiter-service</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              API rate limiting and throttling to prevent abuse and ensure fair usage.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Tech:</strong> Redis, Bucket4j, Spring Cloud Gateway
            </p>
          </div>
        </div>
      </Card>

      {/* Communication & Infrastructure */}
      <Card className="p-6 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communication & Infrastructure</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* API Gateway */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              API Gateway
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Single entry point for all client requests with routing, load balancing, and authentication.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-xs font-semibold text-gray-600 mb-1">Technology</p>
              <p className="text-sm">Spring Cloud Gateway, Kong, Nginx</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Features</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Request routing to microservices</li>
                <li>• JWT token validation</li>
                <li>• Rate limiting and throttling</li>
                <li>• Load balancing</li>
              </ul>
            </div>
          </div>

          {/* Service Discovery */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-lg border border-green-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Service Discovery
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Automatic service registration and discovery for dynamic service location.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-xs font-semibold text-gray-600 mb-1">Technology</p>
              <p className="text-sm">Eureka, Consul, Kubernetes Service Discovery</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Features</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Automatic service registration</li>
                <li>• Health checks</li>
                <li>• Load balancing</li>
                <li>• Failover handling</li>
              </ul>
            </div>
          </div>

          {/* Message Queue */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Message Queue (Async Communication)
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Asynchronous communication between services for decoupling and scalability.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-xs font-semibold text-gray-600 mb-1">Technology</p>
              <p className="text-sm">RabbitMQ, Apache Kafka, AWS SQS</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Use Cases</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Booking notifications</li>
                <li>• Approval workflow events</li>
                <li>• Payment processing</li>
                <li>• Audit log streaming</li>
              </ul>
            </div>
          </div>

          {/* Distributed Tracing */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-lg border border-orange-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Distributed Tracing & Monitoring
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              End-to-end request tracking across microservices for debugging and performance monitoring.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-xs font-semibold text-gray-600 mb-1">Technology</p>
              <p className="text-sm">Zipkin, Jaeger, ELK Stack, Prometheus, Grafana</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Features</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Request tracing across services</li>
                <li>• Performance metrics</li>
                <li>• Error tracking</li>
                <li>• Real-time dashboards</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Database Architecture */}
      <Card className="p-6 border-gray-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Architecture</h2>
        <p className="text-sm text-gray-700 mb-4">
          SimplifyMove follows the "Database per Service" pattern where each microservice has its own database 
          to ensure data isolation and independence.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              MySQL (Primary)
            </h3>
            <p className="text-xs text-gray-700 mb-2">Relational data storage for transactional operations</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Companies, Users, Bookings</li>
              <li>• Transactions, Expenses</li>
              <li>• Policies, Approvals</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-600" />
              MongoDB (Secondary)
            </h3>
            <p className="text-xs text-gray-700 mb-2">NoSQL storage for flexible, document-based data</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Analytics data</li>
              <li>• Audit logs</li>
              <li>• Unstructured documents</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Redis (Cache)
            </h3>
            <p className="text-xs text-gray-700 mb-2">In-memory cache for high-performance data access</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Session storage</li>
              <li>• Frequently accessed data</li>
              <li>• Rate limiting counters</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Deployment Strategy */}
      <Card className="p-6 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deployment Strategy</h2>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">Containerization with Docker</h3>
            <p className="text-sm text-gray-700 mb-3">
              Each microservice is containerized using Docker for consistent deployment across environments.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Docker Images</p>
                <p className="text-sm">Each service has its own Dockerfile and image</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Docker Compose</p>
                <p className="text-sm">Multi-container orchestration for local development</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg border border-green-200">
            <h3 className="font-bold text-gray-900 mb-3">Orchestration with Kubernetes</h3>
            <p className="text-sm text-gray-700 mb-3">
              Kubernetes manages container deployment, scaling, and networking in production.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Pods</p>
                <p className="text-sm">Each service runs in isolated pods</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Services</p>
                <p className="text-sm">Internal load balancing and discovery</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-semibold text-gray-600 mb-1">Auto-scaling</p>
                <p className="text-sm">Horizontal pod autoscaling (HPA)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3">CI/CD Pipeline</h3>
            <p className="text-sm text-gray-700 mb-3">
              Automated build, test, and deployment pipeline using modern DevOps tools.
            </p>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded text-center">
                <p className="text-xs font-semibold text-gray-900">Source Control</p>
                <p className="text-xs text-gray-600 mt-1">Git, GitHub/GitLab</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-xs font-semibold text-gray-900">Build</p>
                <p className="text-xs text-gray-600 mt-1">Maven, Jenkins</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-xs font-semibold text-gray-900">Test</p>
                <p className="text-xs text-gray-600 mt-1">JUnit, Mockito</p>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <p className="text-xs font-semibold text-gray-900">Deploy</p>
                <p className="text-xs text-gray-600 mt-1">ArgoCD, Helm</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Implementation Summary</h2>
            <p className="text-sm text-gray-600">Complete architecture overview</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">15</p>
            <p className="text-sm text-gray-700">Core Microservices</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">8</p>
            <p className="text-sm text-gray-700">Nanoservices</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">4</p>
            <p className="text-sm text-gray-700">Infrastructure Services</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-orange-600 mb-1">27</p>
            <p className="text-sm text-gray-700">Total Services</p>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Development Phases</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Phase 1: Core Services</p>
                <p className="text-xs text-gray-600">Authentication, User Management, Company Management, Wallet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Phase 2: Booking Services</p>
                <p className="text-xs text-gray-600">Travel Booking, Logistics Booking, Approval Workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Phase 3: Support Services</p>
                <p className="text-xs text-gray-600">Analytics, Reporting, Audit, Support, Subscription</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">4</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Phase 4: Nanoservices & Infrastructure</p>
                <p className="text-xs text-gray-600">Notifications, File Storage, Caching, Search, Rate Limiting</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
