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

type CropProtectionInfo = {
    code: number;
    plotCropId: number;
    protectionName: string;
    protectionDeployExpectedDate: string; // Format: 'YYYY-MM-DD'
    protectionDeployActualDate: string;   // Format: 'YYYY-MM-DD'
    protectionDeployActualDateNotes: string;
};

const CropHarvest: React.FC<{ project: Project, cropCode: number }> = ({ project, cropCode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cropDetail, setCropDetail] = useState<any>();
    const [editCropProtection, setEditCropProtection] = useState<any>(null);
    const [plots, setPlots] = useState<Plot[]>([]);
    const [reloadList, setReloadList] = useState(false);
    const [soilDataOptions, setSoilDataOptions] = useState<Soil[]>([]);
    const [isChangeStatus, setIsChangeStatus] = useState(false);
    const [expandedItem, setExpandedItem] = useState<boolean>(false);
    const [currentSelectedForm, setCurrentSelectedForm] = useState<string>('')

    const openAddModal = () => {
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

    const openChangeStatusModal = (land: any) => {
        setEditCropProtection(land);
        setModalVisible(true);
        setIsChangeStatus(true);
    };

    const handleDelete = (yieldId: string) => {
        const deletePlot = async () => {
            try {
                const response = await CropService.deleteYield(yieldId);
                showToast('success', 'Delete Yield', 'Yield has been Deleted Successfully');
            } catch (error) {
                showToast('error', 'Delete Yield', 'Yield has been Deleted Successfully');
            }
        };
        deletePlot();
        setReloadList(!reloadList);
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
            plotCropId: cropDetail?.cropId,
            expectedDate: values?.expectedDate,
            harvestingYieldKilosExpected: values?.harvestingYieldKilosExpected,
            harvestingIntervalCountExpected: values?.harvestingIntervalCountExpected
        };

        console.log("harvestStartData", harvestStartData)


        const harvestEndData = {
            plotCropId: cropDetail?.cropId,
            expectedDate: values?.expectedDate,
        }

        console.log("harvestEndData", harvestEndData)

        // if (currentSelectedForm === "HARVESTSTARTEXPECTED") {
        //     (harvestData as any).harvestingYieldKilosExpected = values.harvestingYieldKilosExpected
        //     (harvestData as any).harvestingIntervalCountExpected = values.harvestingIntervalCountExpected
        // }



        const addPlot = async () => {
            try {
                const response = currentSelectedForm === "HARVESTSTARTEXPECTED" ? await CropService.updateharveststartexpectedDate(harvestStartData) : await CropService.updateharvestendexpectedDate(harvestEndData)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        };
        addPlot();
        setReloadList(!reloadList);
    }

    const handleAddEditYield = async (values: any) => {
        const harvestStartData = {
            plotCropId: cropDetail?.cropId,
            harvestDate: values?.expectedDate,
            yieldCollectedKillosCount: values?.harvestingYieldKilosExpected,
        };

        console.log("harvestStartData", harvestStartData)



        const addPlot = async () => {
            try {
                const response = await CropService.addUpdateCropHarvest(harvestStartData)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        };
        addPlot();
        setReloadList(!reloadList);
    }

    const handleHarvestStartActual = async (values: any) => {
        const harvestData = {
            plotCropId: cropDetail?.cropId,
            actualDate: values.actualDate,
            actualDateNotes: values.actualDateNotes,
        };

        const addPlot = async () => {
            try {
                const response = currentSelectedForm === "HARVESTSTARTACTUAL" ? await CropService.updateharveststartactualDate(harvestData) : await CropService.updateharvestendactualDate(harvestData)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        };
        addPlot();
        setReloadList(!reloadList);
    }


    const handleUpdatePlot = async (values: any) => {
        const protectionData = {
            code: values.code,
            plotCropId: cropDetail?.cropId,
            protectionDeployActualDate: values.protectionDeployActualDate,
            protectionDeployActualDateNotes: values.protectionDeployActualDateNotes,
        };
        const updatePlot = async () => {
            try {
                const response = await CropService.updateProtectionActualDate(protectionData);
                console.log(response, "response")
                showToast('success', 'Actual Protection Date', 'Actual Protection has been added Successfully');
            } catch (error) {
                showToast('error', 'Actual Protection Date', 'Error');
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
        const fetchCropDetail = async () => {
            try {
                const response = await CropService.getcropDetailbycropid(project.projectId, cropCode);
                setCropDetail(response.result || []);
                console.log(response.result, "res")
            } catch (error) {
            }
        };
        fetchCropDetail();
    }, [reloadList]);

    const renderYieldItem = (item: any ) => {
        return (
            <View key= {item.code} style={styles.card}>
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
                <Text style={styles.modalTitle}>{editCropProtection ? 'Edit CropHarvest' : 'Add CropHarvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropDetail?.cropId || '',
                        expectedDate: editCropProtection?.expectedDate || '',
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
                                placeholder="Harvest Start Expected Date"
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
                <Text style={styles.modalTitle}>{editCropProtection ? 'Edit CropHarvest' : 'Add CropHarvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropDetail?.cropId || '',
                        actualDate: editCropProtection?.actualDate || '',
                        actualDateNotes: editCropProtection?.actualDateNotes as string || '',
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
                                error={touched.actualDateNotes && errors.actualDateNotes ? errors.actualDateNotes : ''}
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
                <Text style={styles.modalTitle}>{editCropProtection ? 'Edit CropHarvest' : 'Add CropHarvest'}</Text>
                <Formik
                    initialValues={{
                        plotCropId: cropDetail?.cropId || '',
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
                                placeholder="Harvesting Yield Kilos Expected"
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
        return addEditHarvestYield();
    }

    return (
        <View style={{ flex: 1, marginTop: 20 }}>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest Start:</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                                {cropDetail?.harvestStartExpectedDate !== null ? <TouchableOpacity onPress={() => openEditModal(cropDetail, 'HARVESTSTARTEXPECTED')}>
                                    <Icon name="pencil" size={22} color="#388e3c" />
                                </TouchableOpacity> :
                                    <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                                        <Icon name="plus-circle" size={24} color='#388e3c' />
                                        <Text style={styles.addBtnText}>Add Protection</Text>
                                    </TouchableOpacity>}
                            </View>
                        </View>
                        <Text style={styles.subItem}>- Expected: {AppFunctions.formatDate(cropDetail?.harvestStartExpectedDate)}</Text>
                        {/* <Text style={styles.subItem}>- Harvest Expected(Kilos): {cropDetail?.harvestingYieldKilosExpected}</Text>
                        <Text style={styles.subItem}>- Harvest Interval Count Expected: {cropDetail?.harvestingIntervalCountExpected}</Text> */}
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                        {cropDetail?.harvestStartExpectedDate !== null ? <TouchableOpacity onPress={() => openEditModal(cropDetail, 'HARVESTSTARTACTUAL')}>
                            <Icon name="pencil" size={22} color="#388e3c" />
                        </TouchableOpacity> :
                            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                                <Icon name="plus-circle" size={24} color='#388e3c' />
                                <Text style={styles.addBtnText}>Add Protection</Text>
                            </TouchableOpacity>}
                    </View>
                    <Card.Content>
                        <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest Start:</Text>
                        <Text style={styles.subItem}>- Actual: {AppFunctions.formatDate(cropDetail?.harvestStartActualDate)}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <View >
                            <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Yield Collection:</Text>
                            <Text style={styles.subItem}>-Total Yield Collected : {cropDetail?.harvests.map((item:any)=>{ return item.yieldCollectedKillosCount}).reduce((sum:number, num:number) => sum + num, 0)}</Text>
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
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                        {cropDetail?.harvestStartExpectedDate !== null ? <TouchableOpacity onPress={() => openEditModal(cropDetail, 'HARVESTENDEXPECTED')}>
                            <Icon name="pencil" size={22} color="#388e3c" />
                        </TouchableOpacity> :
                            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                                <Icon name="plus-circle" size={24} color='#388e3c' />
                                <Text style={styles.addBtnText}>Add Protection</Text>
                            </TouchableOpacity>}
                    </View>
                    <Card.Content>
                        <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest End:</Text>
                        <Text style={styles.subItem}>- Expected: {AppFunctions.formatDate(cropDetail?.harvestEndExpectedDate)}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                        {cropDetail?.harvestStartExpectedDate !== null ? <TouchableOpacity onPress={() => openEditModal(cropDetail, 'HARVESTENDACTUAL')}>
                            <Icon name="pencil" size={22} color="#388e3c" />
                        </TouchableOpacity> :
                            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                                <Icon name="plus-circle" size={24} color='#388e3c' />
                                <Text style={styles.addBtnText}>Add Protection</Text>
                            </TouchableOpacity>}
                    </View>
                    <Card.Content>
                        <Text style={styles.section}><MaterialCommunityIcons name="corn" size={18} color="#8BC34A" />  Harvest End:</Text>
                        <Text style={styles.subItem}>- Actual: {AppFunctions.formatDate(cropDetail?.harvestEndActualDate)}</Text>

                    </Card.Content>
                </Card>
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

    container: { padding: 16, marginVertical: 10 },
    card: { borderRadius: 12, elevation: 3, backgroundColor: "#fff", marginVertical: 10 },
    row: { fontSize: 16, marginVertical: 4 },
    section: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
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
    // card: {
    //     backgroundColor: '#fff',
    //     borderRadius: 10,
    //     padding: 16,
    //     marginBottom: 16,
    //     elevation: 2,
    // },
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
        justifyContent:"flex-end"
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

