/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/import { abstractFloatShaderBuilder, abstractIntShaderBuilder,
  basicExpressionBuilder } from

'../expression.js';

/* @returns a ShaderBuilder that evaluates a prefix unary operation */
export function unary(op) {
  return basicExpressionBuilder((value) => `${op}(${value})`);
}

/* @returns a ShaderBuilder that evaluates a prefix unary operation that returns AbstractFloats */
export function abstractFloatUnary(op) {
  return abstractFloatShaderBuilder((value) => `${op}(${value})`);
}

/* @returns a ShaderBuilder that evaluates a prefix unary operation that returns AbstractInts */
export function abstractIntUnary(op) {
  return abstractIntShaderBuilder((value) => `${op}(${value})`);
}