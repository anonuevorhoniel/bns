import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
export default function ChangePassword() {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const handlePasswordSubmit = () => {};

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">
                                Current Password
                            </Label>
                            <Input
                                id="current-password"
                                type="password"
                                placeholder="Enter current password"
                                value={passwordForm?.currentPassword}
                                onChange={(e) =>
                                    setPasswordForm((prev: any) => ({
                                        ...prev,
                                        currentPassword: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="Enter new password"
                                value={passwordForm?.newPassword}
                                onChange={(e) =>
                                    setPasswordForm((prev: any) => ({
                                        ...prev,
                                        newPassword: e.target.value,
                                    }))
                                }
                                required
                            />
                            <p className="text-sm text-gray-500">
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordForm?.confirmPassword}
                                onChange={(e) =>
                                    setPasswordForm((prev: any) => ({
                                        ...prev,
                                        confirmPassword: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                !passwordForm?.currentPassword ||
                                !passwordForm?.newPassword ||
                                passwordForm?.newPassword !==
                                    passwordForm?.confirmPassword ||
                                passwordForm?.newPassword.length < 8
                            }
                        >
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
