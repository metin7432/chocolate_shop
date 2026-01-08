import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe('sk_test_51SUriq4rfVZRzdXqrPkueNJvFGHDswcBPG4HQVZEfcd0hqDDdFnnLZVr176u2tTCFk1z8BmmV2fhKtIiuvtl2erI00iJF5QfLB');