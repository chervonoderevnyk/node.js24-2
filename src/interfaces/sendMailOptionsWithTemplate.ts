import { SendMailOptions } from "nodemailer";

export interface SendMailOptionsWithTemplate extends SendMailOptions {
  template: string; // Обов'язкова властивість для шаблону
  context: Record<string, string>; // Дані для шаблону
}
