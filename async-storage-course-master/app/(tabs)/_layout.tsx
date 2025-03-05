import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#09184D',
        },
        headerTintColor: '#ffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          
        },
        headerTitleAlign: 'center',
      }}>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" options={{
        title: "Estudiantes"
      }} />
    </Stack>
  )
}