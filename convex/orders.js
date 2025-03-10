import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateOrder = mutation({
  args: {
    user: v.id("users"),
    email: v.string(),
    name: v.string(),
    amount: v.number(),
    orderCode: v.number(),
    product: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      user: args.user,
      email: args.email,
      name: args.name,
      orderCode: args.orderCode,
      amount: args.amount,
      status: "PENDING",
      product: args.product
    });
  },
});

export const GetOrder = query({
  args: {
    orderCode: v.number(), 
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("orders")
      .withIndex("by_orderCode", (q) => q.eq("orderCode", args.orderCode))
      .first(); 
    return result;
  },
});

export const GetNextOrderCode = query(async (ctx) => {
  const lastOrder = await ctx.db.query("orders").order("desc").first();
  return lastOrder ? lastOrder.orderCode + 1 : 1235;
});

export const UpdateOrderStatus = mutation({
  args: {
    orderCode: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("orderCode"), args.orderCode))
      .collect();

    if (!order) {
      throw new Error(
        `Không tìm thấy đơn hàng với orderCode: ${args.orderCode}`
      );
    }
    const result = await ctx.db.patch(order[0]._id, {
      status: args.status,
    });

    return result;
  },
});
