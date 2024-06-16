-- Connect to or switch to the biztime database
\c biztime

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS industries_companies;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

-- Create companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Insert initial data into companies table
INSERT INTO companies (code, name, description)
VALUES 
    ('apple', 'Apple Computer', 'Maker of OSX.'),
    ('ibm', 'IBM', 'Big blue.');

-- Create invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    comp_code TEXT NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
    amt FLOAT NOT NULL CHECK (amt > 0),
    paid BOOLEAN DEFAULT false NOT NULL,
    add_date DATE DEFAULT CURRENT_DATE NOT NULL,
    paid_date DATE
);

-- Insert initial data into invoices table
INSERT INTO invoices (comp_code, amt, paid, paid_date)
VALUES 
    ('apple', 100, false, null),
    ('apple', 200, false, null),
    ('apple', 300, true, '2018-01-01'),
    ('ibm', 400, false, null);

-- Create industries table
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    industry TEXT NOT NULL UNIQUE
);

-- Insert initial data into industries table
INSERT INTO industries (code, industry)
VALUES 
    ('acct', 'Accounting'),
    ('tech', 'Technology');

-- Create company_industries table to manage many-to-many relationship
CREATE TABLE industries_companies (
    company_code TEXT NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
    industry_code TEXT NOT NULL REFERENCES industries(code) ON DELETE CASCADE,
    PRIMARY KEY (company_code, industry_code)
);

-- Insert initial data into company_industries table
INSERT INTO industries_companies (company_code, industry_code)
VALUES 
    ('apple', 'tech');
