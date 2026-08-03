import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_REGISTER = { fullName: "", email: "", password: "" };

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const errorMessage = useAuthStore((state) => state.errorMessage);

  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const ok = await login(loginForm.email.trim(), loginForm.password);

    setSubmitting(false);
    // Cualquier cuenta válida puede iniciar sesión; es AdminRoute (en el
    // router) el que decide si puede quedarse en /admin o la devuelve al
    // sitio público, según si tiene el rol "admin".
    if (ok) navigate("/admin", { replace: true });
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const ok = await register(
      registerForm.fullName.trim(),
      registerForm.email.trim(),
      registerForm.password,
    );

    setSubmitting(false);
    if (ok) navigate("/admin", { replace: true });
  };

  return (
    <Tabs defaultValue="login">
      <TabsList className="w-full">
        <TabsTab value="login" className="flex-1">
          Iniciar sesión
        </TabsTab>
        <TabsTab value="register" className="flex-1">
          Crear cuenta
        </TabsTab>
        <TabsIndicator />
      </TabsList>

      <TabsPanel value="login" className="pt-6">
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Correo</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Iniciar sesión
          </Button>
        </form>
      </TabsPanel>

      <TabsPanel value="register" className="pt-6">
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-1.5">
            <Label htmlFor="register-name">Nombre completo</Label>
            <Input
              id="register-name"
              autoComplete="name"
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm((f) => ({ ...f, fullName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-email">Correo</Label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-password">Contraseña</Label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
              minLength={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 6 caracteres, con una mayúscula, una minúscula y un número.
            </p>
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Crear cuenta
          </Button>
        </form>
      </TabsPanel>
    </Tabs>
  );
};
