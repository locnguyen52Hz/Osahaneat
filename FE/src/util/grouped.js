export function groupOrdersByDateArray(orders) {
  const grouped = orders.reduce((groups, order) => {
    const dateKey = new Date(order.time).toISOString().split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(order);
    return groups;
  }, {});

  // chuyển object → mảng [{date, orders}]
  return Object.entries(grouped).map(([date, orders]) => ({
    date,
    orders,
  }));
}

export function groupFoodsByShop(foods = []) {
  if (!Array.isArray(foods)) return [];

  const grouped = Object.values(
    foods.reduce((acc, food) => {
      if (!acc[food.shopId]) {
        acc[food.shopId] = {
          shopId: food.shopId,
          shopName: food.shopName,
          foods: []
        };
      }

      acc[food.shopId].foods.push({
        foodId: food.foodId,
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image
      });

      return acc;
    }, {})
  );

  return grouped;
}
