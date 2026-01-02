import { Suspense } from "react";
import EnterOtpPage from "@/src/components/auth/Otp";
import Loading from "@/src/components/common/Loading";

export default function OtpPage() {
    return (
        <Suspense fallback={<Loading />}>
            <EnterOtpPage />
        </Suspense>
    )
}