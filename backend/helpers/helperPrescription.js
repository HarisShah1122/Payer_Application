const { body } = require("express-validator");

const helperPrescription = [
  body("erx_no")
    .notEmpty()
    .withMessage("eRx number is required")
    .isString()
    .trim(),
  body("erx_date")
    .notEmpty()
    .withMessage("eRx date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("prescriber_id")
    .notEmpty()
    .withMessage("Prescriber ID is required")
    .isString()
    .trim(),
  body("member_id")
    .notEmpty()
    .withMessage("Member ID is required")
    .isString()
    .trim(),
  body("payer_tpa")
    .notEmpty()
    .withMessage("Payer TPA is required")
    .isString()
    .trim(),
  body("emirates_id")
    .notEmpty()
    .withMessage("Emirates ID is required")
    .isString()
    .trim(),
  body("reason_of_unavailability")
    .notEmpty()
    .withMessage("Reason of unavailability is required")
    .isString()
    .trim(),
  body("name")
    .notEmpty()
    .withMessage("Patient name is required")
    .isString()
    .trim(),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isString()
    .trim(),
  body("date_of_birth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isNumeric()
    .withMessage("Weight must be a number"),
  body("mobile")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isString()
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("fill_date")
    .notEmpty()
    .withMessage("Fill date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("physician")
    .notEmpty()
    .withMessage("Physician is required")
    .isString()
    .trim(),
  body("prescription_date")
    .notEmpty()
    .withMessage("Prescription date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("drugs")
    .isArray({ min: 1 })
    .withMessage("At least one drug is required")
    .custom((drugs) => {
      if (!Array.isArray(drugs) || drugs.length === 0) {
        throw new Error("Drugs array must contain at least one item");
      }
      return true;
    }),
  body("drugs.*.drug_code")
    .notEmpty()
    .withMessage("Drug code is required")
    .isString()
    .trim(),
  body("drugs.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("drugs.*.days_of_supply")
    .notEmpty()
    .withMessage("Days of supply is required")
    .isInt({ min: 1 })
    .withMessage("Days of supply must be a positive integer"),
  body("drugs.*.instructions")
    .notEmpty()
    .withMessage("Instructions are required")
    .isString()
    .trim(),
  body("diagnoses")
    .isArray({ min: 1 })
    .withMessage("At least one diagnosis is required")
    .custom((diagnoses) => {
      if (!Array.isArray(diagnoses) || diagnoses.length === 0) {
        throw new Error("Diagnoses array must contain at least one item");
      }
      return true;
    }),
  body("diagnoses.*.icd_code")
    .notEmpty()
    .withMessage("ICD code is required")
    .isString()
    .trim(),
  body("diagnoses.*.diagnosis_code")
    .notEmpty()
    .withMessage("Diagnosis code is required")
    .isString()
    .trim(),
  body("diagnoses.*.description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .trim(),
  body("diagnoses.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("diagnoses.*.days_of_supply")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Days of supply must be a positive integer"),
];

module.exports = helperPrescription;