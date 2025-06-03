import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Palette, Upload, Save, Trash2 } from 'lucide-react';

interface ProfileSettingsProps { }

interface NotificationSettingsProps { }

interface SecuritySettingsProps { }

interface AppearanceSettingsProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

interface DataManagementSettingsProps { }

const ProfileSettings: React.FC<ProfileSettingsProps> = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [bio, setBio] = useState('Software Engineer');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive updates.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Receive updates via email.</p>
          </div>
          <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={(checked) => setEmailNotifications(checked)} />
        </div>
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Push Notifications</p>
            <p className="text-sm text-muted-foreground">Receive updates on your device.</p>
          </div>
          <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={(checked) => setPushNotifications(checked)} />
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  const [password, setPassword] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
};

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look of your application.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={currentTheme} onValueChange={onThemeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DataManagementSettings: React.FC<DataManagementSettingsProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Manage your data and storage.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};

interface SettingsPageProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentTheme, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <div className="md:hidden">
        <Select onValueChange={setActiveTab} defaultValue={activeTab}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a tab..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profile">Profile</SelectItem>
            <SelectItem value="notifications">Notifications</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="appearance">Appearance</SelectItem>
            <SelectItem value="data">Data Management</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="hidden md:block">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="data">
              <Upload className="mr-2 h-4 w-4" />
              Data Management
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator className="my-4" />
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </TabsContent>
        <TabsContent value="data">
          <DataManagementSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
