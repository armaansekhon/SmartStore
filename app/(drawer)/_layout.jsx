import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../../components/ui/CustomDrawerContent";

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#1d4ed8",
        drawerInactiveTintColor: "#374151",
        drawerStyle: { backgroundColor: "#fff" },
        sceneContainerStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="Notification" options={{ title: "Notification" }} />
      <Drawer.Screen name="Purchase" options={{ title: "Purchase" }} />
      <Drawer.Screen name="Sale" options={{ title: "Sale" }} />
      <Drawer.Screen name="Inventory" options={{ title: "Inventory" }} />
    </Drawer>
  );
}
