import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
  }),
  
  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()),
    user: v.id("users"),
  }),

  orders: defineTable({
    user: v.id("users"),
    email: v.string(),
    name: v.string(),
    orderCode: v.number(), 
    amount: v.number(),
    status: v.string(),
    product: v.number()
  }).index("by_orderCode", ["orderCode"]),
});
