export default async function StripeUserInfo(account, connectionArgs, context) {
  // const stripeGroupObjects = await context.queries.stripeUser(context, account);
  console.log("account ", account._id);
  const { StripePlans, StripeSubscription, StripeProducts } =
    context.collections;
  const StripeSubscriptionResponse = await StripeSubscription.findOne({
    customerId: account._id,
  });
  if (StripeSubscriptionResponse) {
    console.log(
      "StripeSubscriptionResponse ",
      StripeSubscriptionResponse.priceId
    );
    var StripePlansResponse = await StripePlans.findOne({
      planId: StripeSubscriptionResponse.priceId,
    });
    console.log("StripePlansResponse ", StripePlansResponse);
    var StripeProductsResponse = await StripeProducts.findOne({
      priceId: StripeSubscriptionResponse.priceId,
    });
    console.log("StripeProductsResponse ", StripeProductsResponse);
    return {
      amount: StripePlansResponse?.unit_amount,
      planName: StripeProductsResponse?.planName,
      active: StripeProductsResponse?.active || StripePlansResponse?.active,
      currency: StripePlansResponse?.currency,
    };
  }
}
