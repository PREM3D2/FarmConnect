import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';

const tags = ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel'];

export type tagOption = {
    label: string,
    code: string
}

interface TagComponentProps {
    data: tagOption[];
    handleSubmit: (selectedTags: string[]) => void;
    existingTags: string[];
    label?: string
    handleCancel: () => void;
}

const TagCompoent: React.FC<TagComponentProps> = ({ data, handleSubmit, existingTags, label, handleCancel }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(existingTags || []);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select {label ? label : "Tags"}:</Text>
            <View style={styles.chipContainer}>
                {data.map((tag) => (
                    <Chip
                        key={tag.code}
                        style={styles.chip}
                        selected={selectedTags.includes(tag.code)}
                        onPress={() => toggleTag(tag.code)}
                        selectedColor="white"
                        mode="flat"
                    >
                        {tag.label}
                    </Chip>
                ))}
            </View>
            <View style={styles.modalActions}>
                <TouchableOpacity disabled={selectedTags.length < 1} style={styles.saveBtn} onPress={() => { handleSubmit(selectedTags) }}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { handleCancel() }}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'gray',
    },
    chipContainer: {
        backgroundColor: '#f1f8e9',
        paddingVertical: 15,
        paddingHorizontal: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 4,
        backgroundColor: '#3490db',
    },
    selectedText: {
        marginTop: 20,
        fontSize: 14,
        color: '#333',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveBtn: {
        backgroundColor: '#388e3c',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelBtn: {
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelBtnText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TagCompoent;
