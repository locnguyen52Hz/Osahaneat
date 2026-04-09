import DOMPurify from "dompurify";

export const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, { USE_PROFILES: { html: false } });
};

export const formatDate = (time) => {
  const dateObj = new Date(time);
  return dateObj.toISOString().split("T")[0];
};

export const formatTime = (time) => {
  const dateObj = new Date(time);
  return dateObj.toTimeString().slice(0, 5);
};
export const formatDistance = (distance) => {
  if (!distance) return;
  return parseFloat(distance.toFixed(1));
};

export const timeAgo = (timestamp) => {
  const past = new Date(timestamp);
  const now = new Date();

  const ms = now - past;
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(month / 365);

  if (sec < 60) return `${sec} giây trước`;
  if (min < 60) return `${min} phút trước`;
  if (hour < 24) return `${hour} giờ trước`;
  if (day < 30) return `${day} ngày trước`;
  if (month < 12) return `${month} tháng trước`;

  return `${year} năm trước`;
};
