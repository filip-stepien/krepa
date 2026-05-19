import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import type { RecordResult } from 'react-native-health-connect';

type StepsRecord = RecordResult<'Steps'>;

export default function App() {
    const [steps, setSteps] = useState<StepsRecord[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadSteps() {
            const isInitialized = await initialize();
            if (!isInitialized) {
                setError('Health Connect nie jest dostępny');
                return;
            }

            await requestPermission([
                { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
                { accessType: 'read', recordType: 'Steps' }
            ]);

            const result = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'after',
                    startTime: '2023-01-09T12:00:00.405Z'
                }
            });

            setSteps(result.records);
        }

        loadSteps().catch(e => setError(String(e)));
    }, []);

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <>
                    <Text style={styles.title}>Kroki</Text>
                    {steps.length === 0 ? (
                        <Text style={styles.empty}>Brak danych</Text>
                    ) : (
                        steps.map((record, index) => (
                            <Text key={index} style={styles.record}>
                                {new Date(record.startTime).toLocaleDateString('pl-PL')}
                                {': '}
                                {record.count} kroków
                            </Text>
                        ))
                    )}
                </>
            )}
            <StatusBar style='auto' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
    record: {
        fontSize: 16,
        marginBottom: 8
    },
    empty: {
        fontSize: 16,
        color: '#888'
    },
    error: {
        fontSize: 16,
        color: 'red'
    }
});
