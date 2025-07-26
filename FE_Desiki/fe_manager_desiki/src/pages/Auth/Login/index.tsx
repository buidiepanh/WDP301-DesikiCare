import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { callAPIUnAuth } from "../../../api/axiosInstace";

// Import background image
import backgroundImage from "../../../assets/Background/bgBlack2.png";

interface DecodedToken {
  role: { _id: number; name: string };
  [key: string]: any;
}

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (values: LoginFormValues) => {
    try {
      const response = await callAPIUnAuth({
        method: "POST",
        url: "/api/Account/login",
        data: { loginInfo: { email: values.email, password: values.password } },
      });

      if (response.status === 200 || response.status === 201) {
        const token = response?.data.token;
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          const roleId = decoded?.role?._id;

          if (roleId === 1 || roleId === 2) {
            localStorage.setItem("accessToken", token);
            toast.success("Đăng nhập thành công!");
            setTimeout(() => navigate("/"), 800);
          } else {
            toast.error("Tài khoản của bạn không có quyền truy cập.");
          }
        } else {
          toast.error("Không nhận được token từ server");
        }
      } else {
        toast.error("Không đăng nhập được");
      }
    } catch {
      toast.error("Email hoặc mật khẩu không đúng.");
    }
  };

  useEffect(() => {
    form.reset();
    setTimeout(() => setShow(true), 200);
  }, [form]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className={`w-full max-w-md transition-all duration-600 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-2xl font-semibold text-white mb-2">
                Đăng nhập
              </h1>
              <p className="text-white/70 text-center text-sm">
                Dành cho Manager & Admin của Desiki
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(login)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email của bạn"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu của bạn"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="cursor-pointer w-full mt-6 bg-black hover:bg-gray-900 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  ĐĂNG NHẬP
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
