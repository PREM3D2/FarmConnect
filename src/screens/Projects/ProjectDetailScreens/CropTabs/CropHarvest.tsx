import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import * as Yup from 'yup';
import { Formik } from 'formik';
import LandService from '../../../../services/LandService';
import AppTextInput from '../../../../components/AppTextInput';
import { Project } from '../../ProjectListScreen';
import CropService from '../../../../services/CropService';
import { AppFunctions } from '../../../../Helpers/AppFunctions';
import DateControl from '../../../../components/DateControl';
import { showToast } from '../../../../components/ShowToast';
import { Card, Divider } from 'react-native-paper';





const CropHarvest: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editCropProtection, setEditCropProtection] = useState<any>(null);
    const [reloadList, setReloadList] = useState(false);
    const [isChangeStatus, setIsChangeStatus] = useState(false);
    const [expandedItem, setExpandedItem] = useState<boolean>(false);
    const [currentSelectedForm, setCurrentSelectedForm] = useState<string>('')

    const openAddModal = () => {
        setCurrentSelectedForm("");
        setEditCropProtection(null);
        setModalVisible(true);
        setIsChangeStatus(false);
    };


    const openEditModal = (land: any, selectedForm: any) => {
        setCurrentSelectedForm(selectedForm)
        setEditCropProtection(land);
        setModalVisible(true);
        setIsChangeStatus(false);
    };

    const handleDelete = async (yieldId: string) => {
        const deletePlot = async () => {
            try {
                const response = await CropService.deleteYield(yieldId);
                setReloadList(!reloadList);
                showToast('success', 'Delete Yield', 'Yield has been Deleted Successfully');
            } catch (error) {
                showToast('error', 'Delete Yield', 'Yield has been Deleted Successfully');
            }
        };
        await deletePlot();

    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            'Delete Yield',
            `Do you want to Delete the Yield Data?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => handleDelete(id),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleHarvestStartExpected = async (values: any) => {
        const harvestStartData = {
            plotCropId: cropCode,
            expectedDate: values?.expectedDate,
            harvestingYieldKilosExpected: values?.harvestingYieldKilosExpected,
            harvestingIntervalCountExpected: values?.harvestingIntervalCountExpected
        };

        const harvestEndData = {
            plotCropId: cropCode,
            expectedDate: values?.expectedDate,
        }
        const addPlot = async () => {
            try {
                const response = currentSelectedForm === "HARVESTSTARTEXPECTED" ? await CropService.updateharveststartexpectedDate(harvestStartData) : await CropService.updateharvestendexpectedDate(harvestEndData)
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Harvest", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Harvest", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Harvest", error.message);
            }
        };
        await addPlot();
    }

    const handleAddEditYield = async (values: any) => {
        const harvestStartData = {
            plotCropId: cropCode,
            harvestDate: values?.expectedDate,
            yieldCollectedKillosCount: values?.harvestingYieldKilosExpected,
        };

        const addHarvest = async () => {
            try {
                const response = await CropService.addUpdateCropHarvest(harvestStartData);
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Harvest", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Harvest", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Harvest", error.message);
            }
        };
        await addHarvest();
    }

    const handleHarvestStartActual = async (values: any) => {
        const harvestData = {
            plotCropId: cropCode,
            actualDate: values.actualDate,
            actualDateNotes: values.actualDateNotes,
        };

        const changesHarvestStartDate = async () => {
            try {
                const response = currentSelectedForm === "HARVESTSTARTACTUAL" ? await CropService.updateharveststartactualDate(harvestData) : await CropService.updateharvestendactualDate(harvestData)
                const toastType = response.result.success ? 'success' : 'error'
                if (response.result.success) {
                    setReloadList(!reloadList);
                    showToast(toastType, "Harvest", response.result.successMessage);
                }
                else {
                    showToast(toastType, "Harvest", response.result.errorMessage);
                }
            } catch (error: any) {
                showToast('error', "Harvest", error.message);
            }
        };
        await changesHarvestStartDate();     
    }

    useEffect(() => {
        const fetchCropDetail = async () => {
            try {
                const response = await CropService.getcropDetailbycropid(project.projectId, cropCode);
                setCropDetail(response.result || []);
            } catch (error) {
            }
        };
        fetchCropDetail();
    }, [reloadList]);

    const renderYieldItem = (item: any) => {
        return (
            <View key={item.code} style={styles.card}>
                <Card.Content>
                    <View></View>
                    <View style={styles.cardActions}>
                        {/* <TouchableOpacity >
                            <Icon name="pencil" size={22} color="#388e3c" />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => confirmDelete(item.code)}>
                            <MaterialCommunityIcons name="delete" size={22} color="#900" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest Date: {AppFunctions.formatDate(item?.harvestDate)}</Text>
                    <Text style={styles.subItem}>- Harvest Collected : {item?.yieldCollectedKillosCount}</Text>
                </Card.Content>
            </View>)
    };

    const getHarvestStartExpectedDataValidation = currentSelectedForm === "HARVESTSTARTEXPECTED" ? Yup.object().shape({
        expectedDate: Yup.string().required('Expected date is required'),
        harvestingYieldKilosExpected: Yup.number().typeError('Harvest Yield in Kilos must be a number').required('Harvest Yield in Kilos  is required'),
        harvestingIntervalCountExpected: Yup.number().typeError('Harvest Interval Count must be a number').required('Harvest Interval Count  is required'),
    }) : Yup.object().shape({
        expectedDate: Yup.string().required('Expected date is required'),
    })

    const getAddEditHarvestYieldValidation = Yup.object().shape({
        expectedDate: Yup.string().required('Expected date is required'),
        harvestingYieldKilosExpected: Yup.number().typeError('Harvest Yield in Kilos must be a number').required('Harvest Yield in Kilos  is required'),
    })

    const getHarvestStartActualDataValidation = Yup.object().shape({
        actualDate: Yup.string().required('Actual date is required'),
        actualDateNotes: Yup.string().required('Notes  is required'),

    });

    const getHarvestStartExpectedData = () => {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{editCropProtection ? 'Edit Harvest' : 'Add Harvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropCode,
                        expectedDate: currentSelectedForm === "HARVESTSTARTEXPECTED" ? (editCropProtection?.harvestStartExpectedDate || '') : (editCropProtection?.harvestEndExpectedDate || ''),
                        harvestingYieldKilosExpected: editCropProtection?.harvestingYieldKilosExpected as string || '',
                        harvestingIntervalCountExpected: editCropProtection?.harvestingIntervalCountExpected as string || '',
                    }}
                    validationSchema={getHarvestStartExpectedDataValidation}
                    onSubmit={(values, { resetForm }) => {
                        handleHarvestStartExpected(values);
                        setModalVisible(false);
                        resetForm();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}

                            <DateControl
                                value={values.expectedDate}
                                setFieldValue={setFieldValue}
                                name="expectedDate"
                                error={touched.expectedDate && errors.expectedDate ? errors.expectedDate : ''}
                                touched={touched.expectedDate}
                                placeholder="Harvest Expected Date"
                                required={true}
                            />{
                                currentSelectedForm === "HARVESTSTARTEXPECTED" && <>
                                    <AppTextInput
                                        placeholder="Harvesting Yield Kilos Expected"
                                        onBlur={handleBlur('harvestingYieldKilosExpected')}
                                        value={values.harvestingYieldKilosExpected}
                                        required={true}
                                        error={touched.harvestingYieldKilosExpected && errors.harvestingYieldKilosExpected ? errors.harvestingYieldKilosExpected : ''}
                                        onChangeText={handleChange('harvestingYieldKilosExpected')} />
                                    <AppTextInput
                                        placeholder="Harvesting Interval Count Expected"
                                        maxLength={45}
                                        onBlur={handleBlur('harvestingIntervalCountExpected')}
                                        value={values.harvestingIntervalCountExpected}
                                        required={true}
                                        error={touched.harvestingIntervalCountExpected && errors.harvestingIntervalCountExpected ? errors.harvestingIntervalCountExpected : ''}
                                        onChangeText={handleChange('harvestingIntervalCountExpected')} />
                                </>
                            }

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
        )
    }

    const getHarvestStartActualData = () => {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{editCropProtection ? 'Edit Harvest' : 'Add Harvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropCode,
                        actualDate: currentSelectedForm === "HARVESTSTARTACTUAL" ? (editCropProtection?.harvestStartActualDate || '') : (editCropProtection?.harvestEndActualDate || ''),
                        actualDateNotes: currentSelectedForm === "HARVESTSTARTACTUAL" ? (editCropProtection?.harvestStartActualDateNotes || '') : (editCropProtection?.harvestEndActualDateNotes || ''),
                    }}
                    validationSchema={getHarvestStartActualDataValidation}
                    onSubmit={(values, { resetForm }) => {
                        handleHarvestStartActual(values);
                        setModalVisible(false);
                        resetForm();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}

                            <DateControl
                                value={values.actualDate}
                                setFieldValue={setFieldValue}
                                name="actualDate"
                                error={touched.actualDate && errors.actualDate ? errors.actualDate : ''}
                                touched={touched.actualDate}
                                placeholder="Harvest Actual Date"
                                required={true}
                            />
                            <AppTextInput
                                placeholder="Notes"
                                onBlur={handleBlur('actualDateNotes')}
                                value={values.actualDateNotes}
                                required={true}
                                error={touched.actualDateNotes && errors.actualDateNotes as string ? errors.actualDateNotes as string : ''}
                                onChangeText={handleChange('actualDateNotes')} />
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
        )
    }

    const addEditHarvestYield = () => {
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{editCropProtection ? 'Edit Harvest' : 'Add Harvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropCode,
                        expectedDate: editCropProtection?.expectedDate || '',
                        harvestingYieldKilosExpected: editCropProtection?.harvestingYieldKilosExpected as string || '',
                    }}
                    validationSchema={getAddEditHarvestYieldValidation}
                    onSubmit={(values, { resetForm }) => {
                        handleAddEditYield(values);
                        setModalVisible(false);
                        resetForm();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            {/* <Text>{JSON.stringify(errors, null, 2)} </Text> */}

                            <DateControl
                                value={values.expectedDate}
                                setFieldValue={setFieldValue}
                                name="expectedDate"
                                error={touched.expectedDate && errors.expectedDate ? errors.expectedDate : ''}
                                touched={touched.expectedDate}
                                placeholder="Harvest Date"
                                required={true}
                            />
                            <AppTextInput
                                placeholder="Harvesting Yield Kilos Collected"
                                onBlur={handleBlur('harvestingYieldKilosExpected')}
                                value={values.harvestingYieldKilosExpected}
                                required={true}
                                error={touched.harvestingYieldKilosExpected && errors.harvestingYieldKilosExpected ? errors.harvestingYieldKilosExpected : ''}
                                onChangeText={handleChange('harvestingYieldKilosExpected')} />
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
        )
    }

    const getValidationSchema = (isChangeStatus: boolean) =>
        Yup.object().shape({
            protectionDeployExpectedDate: Yup.string().required('Date is required'),
            protectionName: Yup.string().required('Protection Name is required'),
            protectionDeployActualDate: Yup.string()
                .nullable()
                .when([], {
                    is: () => isChangeStatus,
                    then: schema => schema.required('Actual Date is required'),
                    otherwise: schema => schema.nullable(),
                }),
            protectionDeployActualDateNotes: Yup.string()
                .nullable()
                .when([], {
                    is: () => isChangeStatus,
                    then: schema => schema.required('Protection Notes are required'),
                    otherwise: schema => schema.nullable(),
                }),
        });

    const loadFormData = () => {
        if (currentSelectedForm === "HARVESTSTARTEXPECTED" || currentSelectedForm === "HARVESTENDEXPECTED") return getHarvestStartExpectedData();
        if (currentSelectedForm === "HARVESTSTARTACTUAL" || currentSelectedForm === "HARVESTENDACTUAL") return getHarvestStartActualData();
        console.log("currentSelectedForm", currentSelectedForm)
        return addEditHarvestYield();
    }

    return (
        <View style={{ flex: 1, }}>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text style={styles.sectionValue}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest Start:</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                            <Text style={styles.section}>
                                - Expected:  <Text style={styles.sectionValue}>{AppFunctions.formatDate(cropDetail?.harvestStartExpectedDate)} </Text>
                            </Text>
                            {!cropDetail?.harvestStartActualDate && <TouchableOpacity style={styles.section} onPress={() => openEditModal(cropDetail, 'HARVESTSTARTEXPECTED')}>
                                <Icon name="pencil" size={22} color="#388e3c" />
                            </TouchableOpacity>}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                            <Text style={styles.section}>
                                - Actual:<Text style={styles.sectionValue}> {AppFunctions.formatDate(cropDetail?.harvestStartActualDate)}</Text>
                            </Text>
                            <TouchableOpacity style={styles.section} onPress={() => openEditModal(cropDetail, 'HARVESTSTARTACTUAL')}>
                                <Icon name="pencil" size={22} color="#388e3c" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                            <Text style={styles.section}>
                                - Notes:<Text style={styles.sectionValue}> {cropDetail?.harvestStartActualDateNotes} </Text>
                            </Text>

                        </View>
                    </Card.Content>
                </Card>
                {cropDetail?.harvestStartActualDate && <>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View >
                                <Text style={styles.sectionValue}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Yield Collection:</Text>
                                <Text style={styles.subItem}>-Harvest Yield Expected(Kilos) :<Text style={styles.sectionValue}>{cropDetail?.harvestingYieldKilosExpected}</Text> </Text>
                                <Text style={styles.subItem}>-Harvest Yield Interval Count : <Text style={styles.sectionValue}>{cropDetail?.harvestingIntervalCountExpected}</Text> </Text>
                                <Divider style={styles.divider} />
                                <Text style={styles.subItem}>-Total Yield Collected(Kilos) : <Text style={styles.sectionValue}>{cropDetail?.harvests.map((item: any) => { return item.yieldCollectedKillosCount }).reduce((sum: number, num: number) => sum + num, 0)}</Text> </Text>
                                <Text style={styles.subItem}>-Total Yield Interval Count :<Text style={styles.sectionValue}> {cropDetail?.harvests.length} </Text></Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>

                                    <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                                        <Icon name="plus-circle" size={24} color='#388e3c' />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => setExpandedItem(!expandedItem)} style={styles.addBtn}>
                                    <Text style={styles.accordionToggle}>
                                        {expandedItem ? 'Minimize ▲' : 'Expand ▼'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {expandedItem && (
                                <View style={styles.accordionContent}>
                                    {cropDetail?.harvests.map((item: any) => (
                                        renderYieldItem(item)
                                    ))}
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={styles.sectionValue}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest End:</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={styles.section}>
                                    - Expected: <Text style={styles.sectionValue}> {AppFunctions.formatDate(cropDetail?.harvestEndExpectedDate)} </Text>
                                </Text>
                                {!cropDetail?.harvestEndActualDate && <TouchableOpacity style={styles.section} onPress={() => openEditModal(cropDetail, 'HARVESTENDEXPECTED')}>
                                    <Icon name="pencil" size={22} color="#388e3c" />
                                </TouchableOpacity>}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={styles.section}>
                                    - Actual: <Text style={styles.sectionValue}>{AppFunctions.formatDate(cropDetail?.harvestEndActualDate)}</Text>
                                </Text>
                                <TouchableOpacity style={styles.section} onPress={() => openEditModal(cropDetail, 'HARVESTENDACTUAL')}>
                                    <Icon name="pencil" size={22} color="#388e3c" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <Text style={styles.section}>
                                    - Notes: <Text style={styles.sectionValue}> {cropDetail?.harvestEndActualDateNotes}</Text>
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </>}
            </ScrollView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {loadFormData()}

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionValue: { fontSize: 16, fontWeight: 'bold' },
    container: { padding: 16, marginVertical: 10 },
    card: { borderRadius: 12, elevation: 3, backgroundColor: "#fff", marginVertical: 10, marginHorizontal: 10 },
    row: { fontSize: 16, marginVertical: 4 },
    section: { fontSize: 16, marginTop: 10, },
    subItem: { fontSize: 15, marginLeft: 20, marginVertical: 2 },
    divider: { marginVertical: 8 },
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
        justifyContent: "flex-end"
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
    accordionContent: {
        backgroundColor: '#f1f8e9',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    accordionToggle: {
        color: '#388e3c',
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
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

export default CropHarvest;

