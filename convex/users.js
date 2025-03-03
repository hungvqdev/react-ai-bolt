import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (user.length == 0) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        picture: args.picture,
        email: args.email,
        uid: args.uid,
        token: 20000,
      });
      return result
    }
  },
});
// export const CreateUser = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),
//     picture: v.string(),
//     uid: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const existingUser = await ctx.db
//       .query("users")
//       .filter((q) => q.eq(q.field("email"), args.email))
//       .collect();

//     if (existingUser.length > 0) {
//       const user = existingUser[0];
//       const updates = {};
//       if (user.name !== args.name) updates.name = args.name;
//       if (user.picture !== args.picture) updates.picture = args.picture;
//       if (Object.keys(updates).length > 0) {
//         await ctx.db.patch(user._id, updates);
//       }
//       return user; 
//     }
//     const newUser = await ctx.db.insert("users", {
//       name: args.name,
//       picture: args.picture,
//       email: args.email,
//       uid: args.uid,
//       token: 20000, 
//     });
//     return newUser;
//   },
// });

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.userId, {
      token: args.token,
    });
    return result;
  },
});
