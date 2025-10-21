"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KeyRound } from "lucide-react";


export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/role");
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)] p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground">An account will be created if one does not exist</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={signInWithGoogle} className="flex items-center gap-2">
            <KeyRound />
            Sign up with Google 
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
