# Template Expansion Guide

## Current Status
- **Existing Templates:** 9 templates
- **Target:** 40-50 templates across 9 categories
- **Status:** Foundation in place, ready for expansion

---

## Implementation Approach

### **Phase 1: Add Categories (DONE)**
Categories added to `data/templates.json`:
- Web Applications 🌐
- Mobile Applications 📱
- API & Microservices 🔌
- Cloud Native ☁️
- AI/ML & Data 🤖
- Enterprise 🏢
- Financial Services 💰
- IoT & Real-Time 📡
- Security & Identity 🔒

### **Phase 2: Expand Templates (IN PROGRESS)**

Add templates gradually to avoid overwhelming the file. Each template needs:
```javascript
{
  "id": "unique-id",
  "name": "Display Name",
  "category": "category-id",
  "description": "Brief description",
  "tags": ["tag1", "tag2"],
  "complexity": "low|medium|high",
  "icon": "emoji",
  "components": [...],
  "flows": [...]
}
```

---

## Template List to Add (31 more templates)

### **Web Applications (5 more)**
1. ✅ Classic 3-Tier (EXISTS)
2. **Single Page Application (SPA)**
   - Components: Browser, CDN, API Gateway, Backend, Database
3. **Progressive Web App (PWA)**
   - Components: Browser, Service Worker, CDN, API, Cache, Database
4. **Server-Side Rendered (SSR)**
   - Components: Browser, SSR Server, API, Database, Cache
5. **E-commerce Platform**
   - Components: User, Web, Product Service, Cart Service, Payment Gateway, Database
6. **Content Management System**
   - Components: User, CMS Frontend, CMS Backend, Media Storage, Database

### **Mobile Applications (4 more)**
1. ✅ Mobile App (EXISTS)
2. **Cross-Platform Mobile (React Native)**
   - Components: Mobile App, API Gateway, Push Notifications, Backend, Database
3. **Offline-First Mobile**
   - Components: Mobile App, Sync Service, Local DB, Cloud DB, Conflict Resolution
4. **Mobile Banking App**
   - Components: Mobile, Biometric Auth, API Gateway, Core Banking, Database, HSM
5. **Mobile Gaming**
   - Components: Game Client, Game Server, Matchmaking, Leaderboard, Database

### **API & Microservices (5 more)**
1. ✅ Microservices (EXISTS)
2. **RESTful API Gateway**
   - Components: Client, API Gateway, Rate Limiter, Auth, Services, Database
3. **GraphQL API**
   - Components: Client, GraphQL Server, Resolvers, Data Sources, Cache
4. **gRPC Microservices**
   - Components: Client, gRPC Gateway, Service Mesh, Services, Database
5. **Event-Driven Architecture**
   - Components: Producer, Message Broker, Consumers, Event Store, Database
6. **Backend for Frontend (BFF)**
   - Components: Web Client, Mobile Client, Web BFF, Mobile BFF, Services

### **Cloud Native (4 more)**
1. ✅ Cloud-Native AWS (EXISTS)
2. **Serverless Architecture**
   - Components: User, API Gateway, Lambda Functions, DynamoDB, S3, SQS
3. **Kubernetes Cluster**
   - Components: Ingress, Pods, Services, ConfigMaps, Secrets, PV, PVC
4. **Multi-Cloud Deployment**
   - Components: User, Global LB, AWS Region, Azure Region, GCP Region
5. **Edge Computing**
   - Components: IoT Devices, Edge Nodes, Edge Processing, Cloud Sync, Central Cloud

### **AI/ML & Data (5 more)**
1. ✅ RAG Pipeline (EXISTS)
2. ✅ LLM Application (EXISTS)
3. ✅ AI Agent System (EXISTS)
4. **ML Training Pipeline**
   - Components: Data Source, Feature Store, Training, Model Registry, Deployment
5. **Real-Time ML Inference**
   - Components: Client, API, Model Serving, Feature Store, Monitoring
6. **Data Lake Architecture**
   - Components: Data Sources, Ingestion, Raw Storage, Processing, Curated Storage
7. **ETL Pipeline**
   - Components: Source DB, ETL Service, Staging, Transform, Data Warehouse
8. **Streaming Analytics**
   - Components: Data Stream, Stream Processor, Real-time DB, Analytics, Dashboard

### **Enterprise (5 more)**
1. **Enterprise Service Bus (ESB)**
   - Components: Applications, ESB, Message Queue, Transformation, Services
2. **Legacy Modernization**
   - Components: Legacy System, API Wrapper, New Services, Database, Cache
3. **Monolith to Microservices**
   - Components: Monolith, Strangler Facade, New Services, Shared DB, New DBs
4. **Enterprise Data Warehouse**
   - Components: Source Systems, ETL, Staging, DW, OLAP, BI Tools
5. **ERP Integration**
   - Components: ERP System, Integration Layer, Custom Apps, Database, Reporting

### **Financial Services (4 more)**
1. **Payment Gateway**
   - Components: Merchant, Gateway, Payment Processor, Bank, Fraud Detection, Database
2. **Banking Core System**
   - Components: Channels, Core Banking, Account Service, Transaction Service, Database, HSM
3. **Trading Platform**
   - Components: Trader, Trading Engine, Market Data, Order Management, Settlement, Database
4. **Blockchain/Crypto Exchange**
   - Components: User, Exchange, Wallet Service, Blockchain Node, Cold Storage, Hot Wallet

### **IoT & Real-Time (4 more)**
1. **IoT Device Management**
   - Components: IoT Devices, IoT Gateway, Device Registry, MQTT Broker, Database, Dashboard
2. **Smart Home Architecture**
   - Components: Smart Devices, Hub, Cloud Service, Mobile App, Rules Engine, Database
3. **Industrial IoT (IIoT)**
   - Components: Sensors, Edge Gateway, SCADA, Historian, Analytics, Dashboard
4. **Real-Time Analytics**
   - Components: Data Sources, Stream Ingestion, Processing, Time-Series DB, Dashboard

### **Security & Identity (4 more)**
1. ✅ Zero Trust (EXISTS)
2. **Single Sign-On (SSO)**
   - Components: User, SP, IdP, SAML/OIDC, User Store, MFA
3. **Multi-Factor Authentication**
   - Components: User, Auth Service, SMS/Email, TOTP, Biometric, Database
4. **Privileged Access Management (PAM)**
   - Components: Admin, PAM Gateway, Session Recording, Vault, Target Systems, Audit Log

---

## How to Add Templates

### **Step 1: Define Components**
```javascript
"components": [
  {
    "id": "unique-comp-id",
    "name": "Component Name",
    "type": "component-type",
    "trustBoundary": "external|dmz|internal",
    "x": 100,  // X position on canvas
    "y": 200   // Y position on canvas
  }
]
```

### **Step 2: Define Flows**
```javascript
"flows": [
  {
    "from": "source-comp-id",
    "to": "target-comp-id",
    "label": "Flow Description",
    "protocol": "HTTPS|HTTP|SQL|gRPC|etc"
  }
]
```

### **Step 3: Add Metadata**
```javascript
{
  "id": "template-id",
  "name": "Template Name",
  "category": "category-id",
  "description": "What this template represents",
  "tags": ["relevant", "keywords"],
  "complexity": "low",  // low, medium, high
  "icon": "🌐",
  "popular": true,  // Optional: mark as popular
  "components": [...],
  "flows": [...]
}
```

---

## Dashboard Enhancement (TODO)

### **Add Category Filter**
```javascript
// In Dashboard component
const [selectedCategory, setSelectedCategory] = useState('all');

const filteredTemplates = templates.filter(t => 
  selectedCategory === 'all' || t.category === selectedCategory
);
```

### **Add Search**
```javascript
const [searchTerm, setSearchTerm] = useState('');

const searchedTemplates = filteredTemplates.filter(t =>
  t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
);
```

### **Add Category Accordion**
```jsx
{categories.map(category => (
  <div key={category.id}>
    <button onClick={() => toggleCategory(category.id)}>
      {category.icon} {category.name}
    </button>
    {expandedCategory === category.id && (
      <div>
        {templates
          .filter(t => t.category === category.id)
          .map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
      </div>
    )}
  </div>
))}
```

---

## Priority Order

### **High Priority (Add First)**
1. Single Page Application
2. Serverless Architecture
3. Payment Gateway
4. IoT Device Management
5. SSO System

### **Medium Priority**
6. E-commerce Platform
7. ML Training Pipeline
8. Trading Platform
9. Smart Home
10. Enterprise Service Bus

### **Low Priority (Nice to Have)**
11-31. Remaining templates

---

## Testing Each Template

For each new template:
1. ✅ Create project from template
2. ✅ Verify components render correctly
3. ✅ Verify flows are connected
4. ✅ Generate threats
5. ✅ Check threat coverage
6. ✅ Export to PDF

---

## Maintenance

### **Regular Updates**
- Add new templates based on user requests
- Update existing templates with new components
- Deprecate outdated templates
- Keep descriptions current

### **Quality Standards**
- Minimum 4 components per template
- At least 3 data flows
- Clear trust boundaries
- Realistic architecture
- Proper component types

---

## Current Implementation Status

✅ **Completed:**
- Category structure defined
- 9 base templates working
- Template loading system
- Custom template support

⏳ **In Progress:**
- Adding 31 more templates
- Category filtering UI
- Search functionality
- Template preview

🔮 **Future:**
- Template ratings
- User-submitted templates
- Template versioning
- Template marketplace

---

## Quick Add Script

To quickly add a template, use this structure:

```javascript
{
  "id": "spa-app",
  "name": "Single Page Application",
  "category": "web-applications",
  "description": "Modern SPA with API backend",
  "tags": ["spa", "react", "api"],
  "complexity": "medium",
  "icon": "⚡",
  "components": [
    {"id": "browser", "name": "Browser", "type": "external", "trustBoundary": "external", "x": 100, "y": 250},
    {"id": "cdn", "name": "CDN", "type": "server", "trustBoundary": "dmz", "x": 250, "y": 250},
    {"id": "api", "name": "API Gateway", "type": "api", "trustBoundary": "dmz", "x": 400, "y": 250},
    {"id": "backend", "name": "Backend", "type": "service", "trustBoundary": "internal", "x": 550, "y": 250},
    {"id": "db", "name": "Database", "type": "database", "trustBoundary": "internal", "x": 700, "y": 250}
  ],
  "flows": [
    {"from": "browser", "to": "cdn", "label": "HTTPS", "protocol": "HTTPS"},
    {"from": "browser", "to": "api", "label": "REST API", "protocol": "HTTPS"},
    {"from": "api", "to": "backend", "label": "Process", "protocol": "HTTP"},
    {"from": "backend", "to": "db", "label": "Query", "protocol": "SQL"}
  ]
}
```

---

**Next Steps:**
1. Add 5 high-priority templates
2. Implement category filtering in Dashboard
3. Add search functionality
4. Test all new templates
5. Update documentation

**Estimated Time:** 2-3 hours for full implementation
