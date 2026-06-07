import React, { useEffect, useState } from "react";
import OrderDetailsView from "./OrderDetailsView";
import OrderActions from "./OrderActions";
import Review from "../../review/Review";
import { getOrderItems } from "../service/OrderServices";

function OrderDetails({ order, onSubmitRating, action, actionsLabel }) {
  const [orderDetails, setOrderDetails] = useState(order);
  const [foods, setFoods] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  const isReviewMode = orderDetails?.status === "COMPLETED";

  // fetch foods
  useEffect(() => {
    if (!orderDetails?.orderId) return;

    setLoadingItems(true);

    const fetch = async () => {
      try {
        const res = await getOrderItems(orderDetails.orderId);
        setFoods(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingItems(false);
      }
    };

    fetch();
  }, [orderDetails?.orderId]);

  // submit rating
  const handleSubmitRating = async (rating) => {
    if (loadingRating) return;

    const prev = { ...orderDetails };

    setLoadingRating(true);

    setOrderDetails((prev) => ({
      ...prev,
      rating,
    }));

    try {
      await onSubmitRating(rating);
    } catch (err) {
      setOrderDetails(prev);
    } finally {
      setLoadingRating(false);
    }
  };

  return (
    <OrderDetailsView
      order={orderDetails}
      foods={foods}
      loadingItems={loadingItems}
      footer={
        isReviewMode ? (
          <Review
            rating={orderDetails?.rating}
            orderId={orderDetails?.orderId}
            onSubmit={handleSubmitRating}
            loading={loadingRating}
          />
        ) : (
          <OrderActions action={action} label={actionsLabel} />
        )
      }
    />
  );
}

export default OrderDetails;
