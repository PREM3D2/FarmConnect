import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LandService from '../../../services/LandService';
import { useContext } from 'react';
import { ProjectDetailContext } from '../ProjectDetailScreen';
import AppTextInput from '../../../components/AppTextInput';
import AppDropdown from '../../../components/AppDropdown';
import { useRoute } from '@react-navigation/core';
import { Project } from '../ProjectListScreen';


const riserSides = [
    { label: 'Length', value: 'length' },
    { label: 'Width', value: 'width' },
];

type Soil = {
    code: 1,
    soilColor: string,
    soilDesc: string
}
//need to update soilColor dropdown from API
const soilColor = [
    { label: 'Red', value: 1 },
    { label: 'Black', value: 2 },
];

type Plot = {
    code: number;
    projectId: number;
    projectName: string;
    plotName: string;
    plotLength: number;
    plotWidth: number;
    isRiser: boolean;
    riserCalMethod: string;
    plotRiserDistance: number;
    plotBedActualCount: number;
    soilId: number;
    soilColor: string;
    plotTotalArea: number;
    plotBedEstimateCount: number;
};

const Land = ({}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();
    const { project } = (route.params as { project: Project });
    const [editLand, setEditLand] = useState<Plot | null>(null);
    const [plots, setPlots] = useState<Plot[]>([]);
    const [reloadList, setReloadList] = useState(false);
    const [soilDataOptions, setSoilDataOptions] = useState<Soil[]>([]);

    const openAddModal = () => {
        setEditLand(null);
        setModalVisible(true);
    };


    const openEditModal = (land: any) => {
        setEditLand(land);
        setModalVisible(true);
    };

    const handleDelete = (plot: Plot) => {
        const deletePlot = async () => {
            try {
                const response = await LandService.deletePlot(plot.code);
            } catch (error) {
            }
        };
        deletePlot();
        setReloadList(!reloadList);
    };

    const confirmDelete = (plot: Plot) => {
        Alert.alert(
            'Delete Land',
            `Do you want to Delete the Land ${plot.plotName}?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleDelete(plot),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleAddPlot = async (values: any) => {
        const plotData = {
            projectId: project?.projectId,
            plotName: values.plotName,
            plotLength: parseFloat(values.plotLength),
            plotWidth: parseFloat(values.plotWidth),
            isRiser: values.isRiser,
            riserCalMethod: values.riserSide,
            plotRiserDistance: parseFloat(values.plotRiserDistance),
            plotBedActualCount: parseInt(values.plotBedActualCount, 10),
            soilId: values.soilId,
        };
        const addPlot = async () => {
            try {
                await LandService.addPlot(plotData);
            } catch (error) {
            }
        };
        addPlot();
        setReloadList(!reloadList);
    }

    const handleUpdatePlot = async (values: any) => {
        const plotData = {
            projectId: project?.projectId,
            plotName: values.plotName,
            plotLength: parseFloat(values.plotLength),
            plotWidth: parseFloat(values.plotWidth),
            isRiser: values.isRiser,
            riserCalMethod: values.riserSide,
            plotRiserDistance: parseFloat(values.plotRiserDistance),
            plotBedActualCount: parseInt(values.plotBedActualCount, 10),
            soilId: values.soilId,
            code: values.code,
        };
        const updatePlot = async () => {
            try {
                await LandService.updatePlot(plotData);
            } catch (error) {
            }
        };
        updatePlot();
        setReloadList(!reloadList);
    }

    useEffect(() => {
        const fetchSoilData = async () => {
            try {
                const response = await LandService.getAllSoils();
                setSoilDataOptions([...response.result || []]);
            } catch (error) {
                console.error("Error fetching soil data:", error);
            }
        };
        fetchSoilData();
    }, []);

    useEffect(() => {
        console.log("Project ID:", project);
        const fetchPlots = async () => {
            if (typeof project?.projectId !== 'number') return;
            try {
                const response = await LandService.getplotsbyprojectid(project.projectId);
                setPlots(response.result || []);
            } catch (error) {
            }
        };
        fetchPlots();
    }, [reloadList]);

    const validationSchema = Yup.object().shape({
        plotName: Yup.string().max(45).required('Name is required'),
        plotLength: Yup.number().typeError('Length must be a number').required('Length is required'),
        plotWidth: Yup.number().typeError('Width must be a number').required('Width is required'),
        isRiser: Yup.boolean().required(),
        plotRiserDistance: Yup.number().typeError('Riser Distance must be a number').required('Riser Distance is required'),
        plotBedActualCount: Yup.number().typeError('Bed Count must be a number').required('Bed Count is required'),
        riserSide: Yup.string().required('Riser Side is required'),
        soilId: Yup.string().required('soil type is required'),
    });

    const renderLand = ({ item }: { item: Plot }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.landName}>{item.plotName}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => {
                        openEditModal(item);
                    }}>
                        <Icon name="pencil" size={22} color="#388e3c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item)}>
                        <MaterialCommunityIcons name="delete" size={22} color="#900" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.field}>Total Area: {item.plotTotalArea}</Text>
            <Text style={styles.field}>Soil: {item.soilColor}</Text>
            {item.isRiser && (
                <View style={styles.sectionRiser}>
                    <Text style={styles.sectionTitle}>Riser</Text>
                    <Text style={styles.field}>Distance: {item.plotRiserDistance}</Text>
                    <Text style={styles.field}>Actual Bed Count: {item.plotBedActualCount}</Text>
                    <Text style={styles.field}>Estimated Bed Count: {item.plotBedEstimateCount}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Icon name="plus-circle" size={24} color='#388e3c' />
                <Text style={styles.addBtnText}>Add Land</Text>
            </TouchableOpacity>
            <FlatList
                data={plots}
                renderItem={renderLand}
                keyExtractor={item => item.code.toString()}
                contentContainerStyle={{ padding: 16 }}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>{editLand ? 'Edit Land' : 'Add Land'}</Text>
                            <Formik
                                initialValues={{
                                    plotName: editLand?.plotName || '',
                                    plotLength: editLand?.plotLength?.toString() || '',
                                    plotWidth: editLand?.plotWidth?.toString() || '',
                                    isRiser: editLand?.isRiser || false,
                                    plotRiserDistance: editLand?.plotRiserDistance?.toString() || '',
                                    plotBedActualCount: editLand?.plotBedActualCount?.toString() || '',
                                    soilId: editLand?.soilId || '',
                                    riserSide: editLand?.riserCalMethod || riserSides[0].value,
                                    code: editLand?.code || '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if (!editLand) {
                                        handleAddPlot(values);
                                    }
                                    else {
                                        handleUpdatePlot(values);
                                    }
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                    <>
                                        {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}
                                        <AppTextInput
                                            placeholder="Plot Name"
                                            maxLength={45}
                                            onBlur={() => handleBlur('plotName')}
                                            value={values.plotName}
                                            required={true}
                                            error={touched.plotName && errors.plotName ? errors.plotName : ''}
                                            onChangeText={handleChange('plotName')} />
                                        <AppTextInput
                                            placeholder="Length"
                                            onBlur={() => handleBlur('plotLength')}
                                            keyboardType="decimal-pad"
                                            value={values.plotLength}
                                            required={true}
                                            error={touched.plotLength && errors.plotLength ? errors.plotLength : ''}
                                            onChangeText={handleChange('plotLength')} />
                                        <AppTextInput
                                            placeholder="Width"
                                            onBlur={() => handleBlur('plotWidth')}
                                            keyboardType="decimal-pad"
                                            value={values.plotWidth}
                                            required={true}
                                            error={touched.plotWidth && errors.plotWidth ? errors.plotWidth : ''}
                                            onChangeText={handleChange('plotWidth')} />
                                        <View style={styles.checkboxRow}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue('isRiser', !values.isRiser)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={values.isRiser ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={22}
                                                    color="#388e3c"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.checkboxLabel}>Riser</Text>
                                        </View>
                                        <View style={styles.dropdownRow}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={riserSides}
                                                labelField="label"
                                                valueField="value"
                                                value={values.riserSide}
                                                onChange={item => setFieldValue('riserSide', item.value)}
                                                placeholder="Select Riser Side"
                                            />
                                        </View>
                                        {touched.riserSide && errors.riserSide && <Text style={styles.error}>{errors.riserSide}</Text>}
                                        <AppTextInput
                                            placeholder="Riser Distance"
                                            onBlur={() => handleBlur('plotRiserDistance')}
                                            required={true}
                                            error={touched.plotRiserDistance && errors.plotRiserDistance ? errors.plotRiserDistance : ''}
                                            keyboardType="decimal-pad"
                                            value={values.plotRiserDistance}
                                            onChangeText={handleChange('plotRiserDistance')} />
                                        <AppTextInput
                                            placeholder="Bed Actual Count"
                                            onBlur={() => handleBlur('plotBedActualCount')}
                                            required={true}
                                            error={touched.plotBedActualCount && errors.plotBedActualCount ? errors.plotBedActualCount : ''}
                                            keyboardType="decimal-pad"
                                            value={values.plotBedActualCount}
                                            onChangeText={handleChange('plotBedActualCount')} />
                                        <View style={styles.dropdownRow}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={soilDataOptions}
                                                labelField="soilColor"
                                                valueField="code"
                                                value={values.soilId}
                                                onChange={item => setFieldValue('soilId', item.value)}
                                                placeholder="Select Soil Color"
                                            />
                                        </View>
                                        {touched.soilId && errors.soilId && typeof errors.soilId === 'string' && (
                                            <Text style={styles.error}>{errors.soilId}</Text>
                                        )}
                                        <View style={styles.modalActions}>
                                            <TouchableOpacity style={styles.saveBtn} onPress={() => handleSubmit()}>
                                                <Text style={styles.saveBtnText}>Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                                                setModalVisible(false);
                                            }}>
                                                <Text style={styles.cancelBtnText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </Formik>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10,
        margin: 16,
        borderRadius: 8,
        marginBottom: 0,
    },
    addBtnText: {
        marginLeft: 8,
        color: '#388e3c',
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    landName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
    },
    cardActions: {
        flexDirection: 'row',
    },
    field: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    sectionRiser: {
        marginTop: 8,
        backgroundColor: '#f1f8e9',
        borderRadius: 6,
        padding: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: '#388e3c',
        marginBottom: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 24,
        paddingHorizontal: 18,
        width: Dimensions.get('window').width * 0.95,
        maxHeight: Dimensions.get('window').height * 0.92,
        elevation: 6,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
    },
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    dropdown: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: '#fff',
    },
    error: {
        color: '#d32f2f',
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 2,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
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

export default Land;
