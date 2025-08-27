# Fix Cart Total Calculation Bug

## Bug Report
**Issue Type:** Bug  
**Priority:** High  
**Severity:** Critical  
**Environment:** Production

## Problem Description
The shopping cart total calculation is incorrect when products have different tax rates or when discount codes are applied. Users are being charged incorrect amounts, leading to customer complaints and potential revenue loss.

## Steps to Reproduce
1. Add multiple products to cart with different tax rates
2. Apply a discount code
3. Proceed to checkout
4. **Expected:** Total should be (sum of products + tax) - discount
5. **Actual:** Total shows incorrect amount (tax calculated before discount)

## Current Behavior
- Tax is calculated on original price even after discount is applied
- Rounding errors accumulate with multiple items
- Discount percentage is applied incorrectly to tax-inclusive amounts

## Expected Behavior
- Discount should be applied to subtotal before tax calculation
- Tax should be calculated on discounted amount
- Final total should be: `(subtotal - discount) + tax_on_discounted_amount`

## Error Examples

### Example 1: Discount + Tax Issue
```
Product A: $100.00 (10% tax rate)
Discount: 20% off
Current (incorrect): $100 + $10 tax - $20 discount = $90
Expected (correct): ($100 - $20) + ($80 * 0.10) = $88
```

### Example 2: Multiple Items Rounding
```
Product A: $33.33 (tax: $3.33)
Product B: $33.33 (tax: $3.33) 
Product C: $33.34 (tax: $3.33)
Current: Rounds each item then sums = $109.98
Expected: Sum then round = $109.99
```

## Technical Investigation

### Files to Investigate
- `src/services/CartService.js` (likely location of bug)
- `src/utils/TaxCalculator.js` (tax calculation logic)
- `src/utils/DiscountCalculator.js` (discount logic)
- `src/models/Cart.js` (cart total computation)

### Suspected Root Causes
1. **Order of Operations**: Tax calculated before discount applied
2. **Precision Issues**: JavaScript floating point arithmetic errors
3. **Business Logic**: Incorrect tax rate application
4. **Async Issues**: Race condition in calculation pipeline

## AI-Assisted Debugging Approach

### AI Prompts for Investigation
1. **Code Analysis**: "Analyze this cart calculation function and identify potential bugs in tax and discount logic"
2. **Test Case Generation**: "Generate comprehensive test cases for cart total calculation with various tax rates and discounts"
3. **Bug Pattern Recognition**: "What are common patterns that cause incorrect financial calculations in e-commerce applications?"

### Using AI with imdone-cli
```bash
# Pull issue to local environment
imdone pull

# Use AI to analyze the bug
# Open this markdown file in VS Code with Copilot/Claude
# Ask: "Based on this bug description, what code should I examine first?"

# AI can suggest investigation steps and test cases
# Update this file with findings and push back
imdone push
```

## Acceptance Criteria for Fix

### Functional Requirements
- [ ] Cart total calculation is mathematically correct
- [ ] Discount applies to subtotal before tax calculation  
- [ ] Tax calculated on post-discount amount
- [ ] Rounding handled consistently (round final total, not intermediate values)
- [ ] Multiple currencies supported correctly
- [ ] Performance impact is minimal

### Test Requirements
- [ ] Unit tests for all calculation scenarios
- [ ] Integration tests with real tax rates
- [ ] Edge case testing (zero amounts, 100% discounts)
- [ ] Regression tests to prevent future issues
- [ ] Performance tests for large carts

### Documentation Requirements
- [ ] Document correct calculation formula
- [ ] Add inline code comments explaining business logic
- [ ] Update API documentation if endpoints change
- [ ] Create troubleshooting guide for similar issues

## Test Cases to Verify Fix

### Basic Calculations
```javascript
// Test case 1: Simple tax calculation
{
  items: [{ price: 100, quantity: 1, taxRate: 0.10 }],
  expected: { subtotal: 100, tax: 10, total: 110 }
}

// Test case 2: Discount before tax
{
  items: [{ price: 100, quantity: 1, taxRate: 0.10 }],
  discount: { type: 'percentage', value: 20 },
  expected: { subtotal: 100, discount: 20, taxableAmount: 80, tax: 8, total: 88 }
}
```

### Edge Cases
```javascript
// Test case 3: Zero tax rate
// Test case 4: 100% discount
// Test case 5: Multiple items with different tax rates
// Test case 6: Fractional cents handling
```

## Impact Assessment
- **Customer Impact:** High - incorrect charges affect trust
- **Business Impact:** Medium - revenue discrepancies
- **Technical Impact:** Low - isolated to cart calculation
- **Urgency:** High - should be fixed in current sprint

## Related Issues
- DEMO-103: Implement proper currency formatting
- DEMO-104: Add tax exemption for certain customer types

## Demo Workflow
This issue demonstrates:
1. **Bug Investigation**: Using AI to analyze complex business logic
2. **Test-Driven Fixes**: AI-generated test cases before implementation
3. **Documentation**: AI helps explain complex financial calculations
4. **Collaborative Development**: Comments and updates sync via imdone-cli
