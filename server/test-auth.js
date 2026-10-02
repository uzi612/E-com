const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("./controllers/authController");
const { adminOnly } = require("./middleware/adminMiddleware");

async function testAuthUnit() {
  console.log("=== Running Unit Tests for Task uzi612 ===");
  process.env.JWT_SECRET = "test_super_secret_key_12345678901234";

  // Test 1: Password hashing and comparison
  console.log("\n[Test 1] Testing bcrypt password hashing & matching...");
  const rawPassword = "securePassword123";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);
  const isMatch = await bcrypt.compare(rawPassword, hash);
  const isMismatch = await bcrypt.compare("wrongPassword", hash);

  if (isMatch && !isMismatch) {
    console.log("✓ Password hashing & comparison passed!");
  } else {
    console.error("✗ Password comparison failed!");
    process.exit(1);
  }

  // Test 2: JWT token generation and verification
  console.log("\n[Test 2] Testing JWT token generation and verification...");
  const mockUserId = "651a2b3c4d5e6f7a8b9c0d1e";
  const token = generateToken(mockUserId, "admin");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.id === mockUserId && decoded.role === "admin") {
    console.log("✓ JWT signing and verification passed!");
  } else {
    console.error("✗ JWT verification failed!");
    process.exit(1);
  }

  // Test 3: Admin Middleware check
  console.log("\n[Test 3] Testing admin middleware...");
  let adminPassed = false;
  const mockReqAdmin = { user: { role: "admin" } };
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        if (code === 403) customerBlocked = true;
        return data;
      },
    }),
  };
  adminOnly(mockReqAdmin, mockRes, () => {
    adminPassed = true;
  });

  let customerBlocked = false;
  const mockReqCustomer = { user: { role: "customer" } };
  adminOnly(mockReqCustomer, mockRes, () => {});

  if (adminPassed && customerBlocked) {
    console.log("✓ Admin role guard passed!");
  } else {
    console.error("✗ Admin middleware test failed!");
    process.exit(1);
  }

  console.log("\n=========================================");
  console.log("🎉 All Task uzi612 Unit Tests PASSED!");
  console.log("=========================================\n");
}

testAuthUnit().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
