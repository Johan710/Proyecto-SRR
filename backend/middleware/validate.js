// ============================================================
//  middleware/validate.js
//  Centraliza la comprobación de errores de express-validator
// ============================================================
const { validationResult } = require("express-validator");

/**
 * Coloca este middleware DESPUÉS de las reglas de validación.
 * Si hay errores, responde 400 con la lista; si no, llama next().
 *
 * Ejemplo de uso:
 *   router.post("/", [body("email").isEmail(), validate], handler)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: errors.array().map((e) => ({
        campo: e.path,
        mensaje: e.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
