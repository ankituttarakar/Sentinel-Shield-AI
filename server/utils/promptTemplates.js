module.exports = {
  CODE_REVIEW: (code) => `
    You are Sentinel AI, a senior security engineer. 
    Review the following code for:
    1. Critical Vulnerabilities (SQLi, XSS, etc.)
    2. Logic Flaws
    3. Performance Bottlenecks
    
    Code:
    ${code}
    
    Format your response with clear headers and a 'Refactored Version' at the end.
  `,
  SECURITY_ONLY: (code) => `Focus ONLY on security flaws in this code: ${code}`
};