# Implement Product Rating System

## User Story
As a **customer**,
I want to **rate and review products I've purchased**,
So that **I can share my experience and help other customers make informed decisions**.

## Description
Currently, the e-commerce platform displays products but doesn't allow customers to provide ratings or reviews. This feature will add a 5-star rating system with optional text reviews.

## Acceptance Criteria

### Rating System
- [ ] Customers can rate products from 1 to 5 stars
- [ ] Only authenticated users who purchased the product can rate it
- [ ] Users can only rate each product once (can update their rating)
- [ ] Ratings are displayed as average score on product pages
- [ ] Rating count is shown alongside average rating

### Review System  
- [ ] Customers can write optional text reviews (50-500 characters)
- [ ] Reviews are displayed on product detail pages
- [ ] Reviews show customer name (first name + last initial)
- [ ] Reviews include timestamp
- [ ] Reviews can be sorted by newest, oldest, highest rated, lowest rated

### API Endpoints
- [ ] `POST /api/products/:id/ratings` - Submit rating/review
- [ ] `GET /api/products/:id/ratings` - Get all ratings for a product
- [ ] `PUT /api/products/:id/ratings/:ratingId` - Update user's rating
- [ ] `DELETE /api/products/:id/ratings/:ratingId` - Delete user's rating (admin only)

### Database Schema
- [ ] Create Rating model with fields: userId, productId, rating, review, createdAt, updatedAt
- [ ] Add indexes for efficient querying
- [ ] Update Product model to cache average rating and count

## Technical Implementation

### Backend Changes Required
1. **Create Rating Model** (`src/models/Rating.js`)
   - User reference (who rated)
   - Product reference (what was rated)
   - Rating value (1-5)
   - Review text (optional)
   - Timestamps

2. **Create Rating Routes** (`src/routes/ratings.js`)
   - CRUD operations for ratings
   - Validation using Joi
   - Authentication middleware

3. **Update Product Model**
   - Add calculated fields for average rating
   - Add rating count field
   - Create method to recalculate ratings

4. **Authentication Middleware**
   - Verify user is logged in
   - Check if user purchased the product (future enhancement)

### Frontend Integration Points
- Product detail page rating display
- Rating submission form
- Review list component
- Rating filter/sort controls

## Demo Scenarios

### Scenario 1: First-time Rating
1. User views product detail page
2. Clicks "Rate this product" 
3. Selects 4 stars and writes review
4. Submits rating
5. Page updates to show new average rating

### Scenario 2: Rating Management
1. User who previously rated returns to product
2. Sees their existing rating
3. Updates rating from 4 to 5 stars
4. Edits review text
5. Saves changes

### Scenario 3: AI-Assisted Development
1. Developer pulls this issue with `imdone pull`
2. Uses AI to generate Rating model: "Create a Mongoose model for product ratings based on the acceptance criteria"
3. AI generates boilerplate code for routes
4. Developer implements and tests
5. Updates status to "In Review" and pushes back with `imdone push`

## Files to Create/Modify
- `src/models/Rating.js` (new)
- `src/routes/ratings.js` (new)  
- `src/routes/products.js` (modify to include ratings)
- `src/app.js` (add rating routes)
- Update Product model rating fields

## Testing Requirements
- [ ] Unit tests for Rating model validation
- [ ] Integration tests for rating API endpoints
- [ ] Test authentication requirements
- [ ] Test rating calculation accuracy
- [ ] Test edge cases (duplicate ratings, invalid data)

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Demo recorded for stakeholders
