/**
 * ParticleEffect Component
 * Particles spawn from circle edge, float upward with wobble
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SPAWN_RATE = 500;

export default function ParticleEffect({ isActive, circleSize, color = '#00FF88' }) {
    const [particles, setParticles] = useState([]);
    const particleIdRef = useRef(0);

    useEffect(() => {
        if (!isActive) {
            setParticles([]);
            return;
        }

        const spawnInterval = setInterval(() => {
            const id = particleIdRef.current++;
            
            const angle = Math.random() * Math.PI * 2;
            const radius = circleSize / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const newParticle = {
                id,
                x,
                y,
                size: 3 + Math.random() * 5,
                opacity: new Animated.Value(0.4 + Math.random() * 0.4),
                translateY: new Animated.Value(0),
                translateX: new Animated.Value(0),
                wobbleX: (Math.random() - 0.5) * 15,
            };

            setParticles(prev => [...prev, newParticle]);

            // Use Easing functions properly
            Animated.parallel([
                Animated.timing(newParticle.translateY, {
                    toValue: -200,
                    duration: 4000,
                    easing: Easing.out(Easing.quad), // ✅ Changed from Easing.ease
                    useNativeDriver: true,
                }),
                Animated.timing(newParticle.translateX, {
                    toValue: newParticle.wobbleX,
                    duration: 4000,
                    easing: Easing.inOut(Easing.quad), // ✅ Changed from Easing.sine
                    useNativeDriver: true,
                }),
                Animated.timing(newParticle.opacity, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.out(Easing.quad), // ✅ Changed from Easing.ease
                    useNativeDriver: false, // ❌ Opacity cannot use native driver
                }),
            ]).start(() => {
                setParticles(prev => prev.filter(p => p.id !== id));
            });
        }, SPAWN_RATE);

        return () => {
            clearInterval(spawnInterval);
        };
    }, [isActive, circleSize]);

    if (!isActive) return null;

    return (
        <View style={styles.container}>
            {particles.map(particle => (
                <Animated.View
                    key={particle.id}
                    style={[
                        styles.particle,
                        {
                            width: particle.size,
                            height: particle.size,
                            borderRadius: particle.size / 2,
                            backgroundColor: color,
                            opacity: particle.opacity,
                            left: '50%',
                            top: '50%',
                            marginLeft: particle.x - particle.size / 2,
                            marginTop: particle.y - particle.size / 2,
                            transform: [
                                { translateY: particle.translateY },
                                { translateX: particle.translateX },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    particle: {
        position: 'absolute',
    },
});