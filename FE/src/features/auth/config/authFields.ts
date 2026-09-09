import { AuthField } from "../../../types/auth/AuthField";
import { BuyerRegisterCredentials } from "../../../types/auth/BuyerRegisterCredentials";
import { ShopRegisterCredentials } from "../../../types/auth/ShopRegisterCredentials";

const buyerCommonFields: AuthField<BuyerRegisterCredentials>[] = [
  {
    name: "fullName",
    id: "full-name",
    label: "Full Name",
    placeholder: "Enter your name",
    type: "text",
    icon: "bi-person",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      maxLength: {
        value: 50,
        message: "Tối đa 50 ký tự",
      },
      minLength: {
        value: 2,
        message: "Tối thiểu 2 ký tự",
      },
      pattern: {
        value: /^[a-zA-ZÀ-ỹ\s]+$/,
        message: "Tên không chứa ký tự đặc biệt hoặc số",
      },
    },
  },

  {
    name: "email",
    id: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
    icon: "bi-envelope",
    autoComplete: "email",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      pattern: {
        value: /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "Email không hợp lệ",
      },
    },
  },

  {
    name: "password",
    id: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    icon: "bi-eye-slash",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      minLength: {
        value: 8,
        message: "Tối thiểu 8 ký tự",
      },
      maxLength: {
        value: 72,
        message: "Tối đa 72 ký tự",
      },
      pattern: {
        value: /^[A-Za-z\d]{8,72}$/,
        message: "Không dùng ký tự đặc biệt",
      },
    },
  },
];

const shopFields: AuthField<ShopRegisterCredentials>[] = [
  {
    name: "fullName",
    id: "full-name",
    label: "Full Name",
    placeholder: "Enter your name",
    type: "text",
    icon: "bi-person",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      maxLength: {
        value: 50,
        message: "Tối đa 50 ký tự",
      },
      minLength: {
        value: 2,
        message: "Tối thiểu 2 ký tự",
      },
      pattern: {
        value: /^[a-zA-ZÀ-ỹ\s]+$/,
        message: "Tên không chứa ký tự đặc biệt hoặc số",
      },
    },
  },

  {
    name: "email",
    id: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
    icon: "bi-envelope",
    autoComplete: "email",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      pattern: {
        value: /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "Email không hợp lệ",
      },
    },
  },

  {
    name: "password",
    id: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    icon: "bi-eye-slash",
    autoComplete: "new-password",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      minLength: {
        value: 8,
        message: "Tối thiểu 8 ký tự",
      },
      maxLength: {
        value: 72,
        message: "Tối đa 72 ký tự",
      },
      pattern: {
        value: /^[A-Za-z\d]{8,72}$/,
        message: "Không dùng ký tự đặc biệt",
      },
    },
  },

  {
    name: "shopName",
    id: "shop-name",
    label: "Shop name",
    placeholder: "Enter your shop name",
    type: "text",
    icon: "bi-shop-window",
    rules: {
      required: {
        value: true,
        message: "Không để trống",
      },
      minLength: {
        value: 3,
        message: "Tối thiểu 3 ký tự",
      },
      maxLength: {
        value: 72,
        message: "Tối đa 72 ký tự",
      },
      pattern: {
        value: /^[A-Za-zÀ-ỹ0-9\s]+$/,
        message: "Không chứa ký tự đặc biệt",
      },
    },
  },

  {
    name: "description",
    id: "description",
    label: "Description",
    placeholder: "Enter your shop description",
    type: "text",
    icon: "bi-file-text",
    rules: {
      maxLength: {
        value: 200,
        message: "Tối đa 200 ký tự",
      },
      pattern: {
        value: /^[A-Za-zÀ-ỹ0-9\s.,!?"'()-]+$/,
        message: "Không chứa ký tự đặc biệt nguy hiểm",
      },
    },
  },

  {
    name: "shopImage",
    id: "shop-image",
    label: "Ảnh đại diện",
    type: "file",
    accept: "image/*",
    icon: "bi-image",
    rules: {
      required: "Vui lòng chọn ảnh",
    },
  },
];

export { buyerCommonFields, shopFields };
