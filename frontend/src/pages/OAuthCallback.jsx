import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { consumePostLoginRedirect } from "../utils/auth";

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            localStorage.setItem("accessToken", token);
            navigate(consumePostLoginRedirect() || "/");
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-on-surface-variant font-medium">로그인 처리 중...</p>
        </div>
    );
}