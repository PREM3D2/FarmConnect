import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface AppSliderProps {
  visible: boolean;
  onClose: () => void;
}

const user = {
  role: 'Farmer',
  name: 'John Doe',
  location: 'Village A',
  notifications: 3,
  profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
};

const AppSlider: React.FC<AppSliderProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.slider}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.text}>Role: {user.role}</Text>
        <Text style={styles.text}>Name: {user.name}</Text>
        <Text style={styles.text}>Location: {user.location}</Text>
        <Text style={styles.text}>Notifications: {user.notifications}</Text>
        <View style={styles.actions}>
          <Text style={styles.actionText}>Profile</Text>
          <Text style={styles.actionText}>Logout</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  slider: {
    width: '80%',
    height: '100%',
    backgroundColor: '#f7faff',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeText: {
    fontSize: 28,
    color: '#007bff',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  text: {
    fontSize: 18,
    marginVertical: 4,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 24,
  },
  actionText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default AppSlider;
