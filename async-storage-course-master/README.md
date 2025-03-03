# Home Component - React Native with AsyncStorage

This project is a simple React Native app that demonstrates how to manage a list of words using AsyncStorage for persistent storage. The app includes basic CRUD operations such as adding, editing, deleting individual items, and clearing the entire list. It is designed to be lightweight, making it easy to set up and run.

## Features

- **Add Words**: Add new words to the list through a text input.
- **Edit Words**: Modify any word in the list with an editable input.
- **Delete Words**: Remove individual words from the list.
- **Clear All Words**: Clear the entire list with a single button click.
- **Persistent Storage**: Data is stored using `AsyncStorage`, ensuring the list is saved even after the app is closed.

## Technologies and Libraries

- **React Native**: A framework for building native apps using React.
- **TypeScript**: Strongly typed programming language used for type safety.
- **AsyncStorage**: Library used for local device storage in React Native.

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm or yarn
- React Native CLI

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
2. **Navigate to the project directory**:
   ```bash
   cd <project-directory>
3. **Install the dependencies**:
   ```bash 
   npm install
4. **Run the project**:
   ```bash 
   npm run start
5. **Run on your mobile device** (make sure you have your emulator or physical device connected):
   ```bash 
   npx react-native run-android  # For Android
   npx react-native run-ios      # For iOS
## Dependencies
- **react-native:** Framework for building native apps.
- **@react-native-async-storage/async-storage:** Library for storing data on the device.
- **react:** JavaScript library for building user interfaces.
- **typescript:** Typed superset of JavaScript that helps catch errors early in the development.
## Licence
This project is licensed under the MIT License.