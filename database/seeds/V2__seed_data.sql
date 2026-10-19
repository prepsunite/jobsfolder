-- PrepUnite Seed Data
-- Provides initial data for development and testing

-- ============================================
-- SEED: Admin User (will be linked via Clerk)
-- ============================================
INSERT INTO users (id, clerk_id, username, email, first_name, last_name, role)
VALUES (
    uuid_generate_v4(),
    'clerk_admin_placeholder',
    'admin',
    'admin@prepunite.com',
    'PrepUnite',
    'Admin',
    'SUPER_ADMIN'
);

-- ============================================
-- SEED: Companies
-- ============================================
INSERT INTO companies (id, name, slug, description, industry, company_size, headquarters, website) VALUES
(uuid_generate_v4(), 'TCS', 'tcs', 'Tata Consultancy Services is an Indian multinational IT services and consulting company.', 'Information Technology', '500,000+', 'Mumbai, India', 'https://www.tcs.com'),
(uuid_generate_v4(), 'Infosys', 'infosys', 'Infosys Limited is an Indian multinational IT company providing business consulting, IT, and outsourcing services.', 'Information Technology', '300,000+', 'Bangalore, India', 'https://www.infosys.com'),
(uuid_generate_v4(), 'Wipro', 'wipro', 'Wipro Limited is an Indian multinational corporation providing IT, consulting, and business process services.', 'Information Technology', '250,000+', 'Bangalore, India', 'https://www.wipro.com'),
(uuid_generate_v4(), 'Accenture', 'accenture', 'Accenture is a global professional services company specializing in IT, consulting, and operations.', 'Consulting', '700,000+', 'Dublin, Ireland', 'https://www.accenture.com'),
(uuid_generate_v4(), 'Cognizant', 'cognizant', 'Cognizant is an American multinational IT services and consulting company.', 'Information Technology', '350,000+', 'Teaneck, USA', 'https://www.cognizant.com'),
(uuid_generate_v4(), 'Google', 'google', 'Google is an American multinational technology company focusing on AI, search, cloud computing, and advertising.', 'Technology', '180,000+', 'Mountain View, USA', 'https://www.google.com'),
(uuid_generate_v4(), 'Microsoft', 'microsoft', 'Microsoft Corporation is an American multinational technology corporation producing software, hardware, and cloud services.', 'Technology', '220,000+', 'Redmond, USA', 'https://www.microsoft.com'),
(uuid_generate_v4(), 'Amazon', 'amazon', 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, and AI.', 'Technology', '1,500,000+', 'Seattle, USA', 'https://www.amazon.com'),
(uuid_generate_v4(), 'Deloitte', 'deloitte', 'Deloitte is a multinational professional services network offering audit, consulting, tax, and advisory services.', 'Consulting', '400,000+', 'London, UK', 'https://www.deloitte.com'),
(uuid_generate_v4(), 'Capgemini', 'capgemini', 'Capgemini is a French multinational IT services and consulting company.', 'Information Technology', '350,000+', 'Paris, France', 'https://www.capgemini.com');
