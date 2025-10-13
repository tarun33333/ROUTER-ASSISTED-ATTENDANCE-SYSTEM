import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal } from 'react-native';
import Constants from 'expo-constants';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/config';
import ButtonPrimary from './ButtonPrimary';

// Safe QR Scanner that handles missing native modules gracefully
export default function SafeQRScanner({ visible, onClose, onScan }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [QRScanner, setQRScanner] = useState(null);

  useEffect(() => {
    // Check if we're in Expo Go (which doesn't support custom native modules)
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      // Don't even try to load QR scanner in Expo Go
      setHasPermission(false);
      return;
    }

    // Try to load QR scanner for development builds
    const loadQRScanner = async () => {
      try {
        // Dynamic import to avoid crashes if module is missing
        const QRCodeScannerModule = require('react-native-qrcode-scanner');
        const QRCodeScanner = QRCodeScannerModule.default || QRCodeScannerModule;
        if (QRCodeScanner) {
          setQRScanner(() => QRCodeScanner);
          setHasPermission(true);
        } else {
          throw new Error('QR Scanner component not found');
        }
      } catch (error) {
        console.warn('QR Scanner not available:', error.message);
        setHasPermission(false);
      }
    };

    if (visible) {
      loadQRScanner();
    }
  }, [visible]);

  const handleScan = (e) => {
    try {
      const qrData = JSON.parse(e.data);
      if (qrData.otp && qrData.ssid) {
        onScan(qrData.otp);
      } else {
        Alert.alert('Invalid QR Code', 'This QR code is not for attendance marking');
      }
    } catch (error) {
      Alert.alert('Invalid QR Code', 'Could not read QR code data');
    }
  };

  if (!visible) return null;

  // If QR scanner is not available, show fallback message
  if (!QRScanner || !hasPermission) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: COLORS.background, 
          padding: SPACING.lg,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.lg, textAlign: 'center' }]}>
            📱 QR Scanner
          </Text>
          <Text style={[TYPOGRAPHY.body, { textAlign: 'center', marginBottom: SPACING.xl, color: COLORS.textSecondary }]}>
            QR Scanner is not available in Expo Go. Please use manual OTP entry or build a development client.
          </Text>
          <Text style={[TYPOGRAPHY.caption, { textAlign: 'center', marginBottom: SPACING.xl, color: COLORS.textSecondary }]}>
            To enable QR scanning, run: {'\n'}
            npx expo run:android {'\n'}
            or {'\n'}
            npx expo run:ios
          </Text>
          <Text style={[TYPOGRAPHY.caption, { textAlign: 'center', marginBottom: SPACING.xl, color: COLORS.textSecondary, fontStyle: 'italic' }]}>
            For now, please use the manual OTP entry above.
          </Text>
          <ButtonPrimary 
            title="Close" 
            onPress={onClose}
            style={{ width: '100%' }}
          />
        </View>
      </Modal>
    );
  }

  // Render actual QR scanner
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <QRScanner
          onRead={handleScan}
          showMarker={true}
          markerStyle={{
            borderColor: COLORS.secondary,
            borderWidth: 2,
          }}
          cameraStyle={{ height: '100%' }}
          topContent={
            <View style={{ 
              backgroundColor: COLORS.background, 
              padding: SPACING.lg,
              alignItems: 'center'
            }}>
              <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.sm }]}>
                📱 Scan QR Code
              </Text>
              <Text style={[TYPOGRAPHY.caption, { textAlign: 'center', color: COLORS.textSecondary }]}>
                Point your camera at the teacher's QR code
              </Text>
            </View>
          }
          bottomContent={
            <View style={{ 
              backgroundColor: COLORS.background, 
              padding: SPACING.lg,
              alignItems: 'center'
            }}>
              <ButtonPrimary 
                title="Cancel" 
                onPress={onClose}
                mode="outlined"
                style={{ width: '100%' }}
              />
            </View>
          }
        />
      </View>
    </Modal>
  );
}
