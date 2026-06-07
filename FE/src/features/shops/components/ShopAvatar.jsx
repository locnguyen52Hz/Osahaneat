function ShopAvatar({ src, alt, size = "medium" }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size === "large" ? 80 : 50,
        height: size === "large" ? 80 : 50,
        objectFit: "cover",
      }}
    />
  );
}

export default ShopAvatar;
