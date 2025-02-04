import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Container,
    Card,
    CardHeader,
    Divider,
    TableRow,
    TablePagination,
    TableCell, Typography, Button, Link, Skeleton, CircularProgress,
} from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { GroupTable } from "@comp/core/buttons";
import { TableStatic } from "@comp/core/tables";
import useAuth from "@hooks/useAuth";
import ManualGiveoutListFilter from "@comp/manualGiveout/ManualGiveoutListFilter";
import {blue, green, red} from "@material-ui/core/colors";
import CreateGiveoutModal from "@comp/manualGiveout/CreateGiveoutModal";

const ManualGiveoutIndex = () => {
    const { user } = useAuth();
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [isManualGiveoutReportDownloading, setManualGiveoutDownloadReport] = useState(false);
    const { settings } = useSettings();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [dataList, setDataList] = useState({
        items: [],
        count: 0,
    });
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(50);
    const { getAccess } = useAuth();

    const [isModalFormOpen, setModalFormOpen] = useState(false);
    const [editableItem, setEditableItem] = useState(null);
    const [filter, setFilter] = useState({});

    const openForm = (item) => {
        setModalFormOpen(true);
        setEditableItem(item);
    };

    const closeForm = () => {
        setModalFormOpen(false);
        setEditableItem(null);
    };

    const fetchManualGiveouts = useCallback(async () => {
        axios.get(`${app.api}/manual/giveout`, {
            params: {
                page: page + 1,
                count: count,
                ...filter
            }
        }).then((response) => {
            setDataList(response.data);
        });
    }, [page, count, filter]);

    const updateManualGiveoutStatus = async (manualGiveoutId, currentStatus) => {
        setIsStatusLoading(true);
        const response = await axios.get(
            `${app.api}/manual/giveout/${manualGiveoutId}/status`
        );

        if (response.data.status !== currentStatus) {
            const updatedList = dataList?.items ? dataList.items.map(item =>
                item.id === manualGiveoutId ? { ...item, status: response.data.status } : item
            ) : [];

            setDataList(prevState => ({
                ...prevState,
                items: updatedList
            }));
        }

        setIsStatusLoading(false);
    };

    const handlePageChange = async (e, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = async (e, newValue) => {
        setCount(newValue.props.value);
    };

    const statuses =  {
        1: 'status_new',
        2: 'status_processing',
        3: 'status_finished',
        4: 'status_failed',
    };

    const availableStatusesForUpdate = [
        1,
        2
    ];

    const statusColors = {
        1: blue[800],
        2: blue[800],
        3: green[800],
        4: red[800],
    };

    const getFileByLink = (linkUrl) => {
        window.open(linkUrl, '_blank', 'noopener,noreferrer');
    };

    const downloadReportClickHandler = async (manualGiveoutId) => {
        setManualGiveoutDownloadReport(true);
        const response = await axios.post(
            `${app.api}/manual/giveout/${manualGiveoutId}/report/create`
        );

        setManualGiveoutDownloadReport(false);
        //getFileByLink(response.data.filePath);
    };

    useEffect(() => {
        fetchManualGiveouts();
    }, [fetchManualGiveouts]);

    return (
        <>
            <Helmet>
                <title>{t("manualGiveoutList")}</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 2,
                }}
            >
                <Container maxWidth={settings.compact ? "xl" : false}>
                    <CreateGiveoutModal
                        open={isModalFormOpen}
                        onClose={closeForm}
                        entity={editableItem}
                        onUpdate={fetchManualGiveouts}
                    />

                    <Box sx={{ minWidth: 700 }}>
                        <Card sx={{ mt: 2 }}>
                            <CardHeader
                                title={t("manualGiveoutList")}
                                action={
                                    <GroupTable
                                        actionCreate={{
                                            access: getAccess("manualGiveout", "create"),
                                            callback: () => {
                                                openForm(null);
                                            },
                                        }}
                                    />
                                }
                            />
                            <Divider />
                            <ManualGiveoutListFilter
                                onSubmit={setFilter}
                            />
                            <Divider />
                            <TableStatic
                                header={[
                                    "id",
                                    "merchantName",
                                    "status",
                                    "manual_giveout_user_created_email",
                                    "actions",
                                ]}
                            >
                                {dataList.items.map(function (item) {
                                    return (
                                        <>
                                            <TableRow hover key={item.id}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.merchantName}</TableCell>
                                                <TableCell>
                                                    <Typography color={statusColors[item.status]}>
                                                        {t(statuses[item.status])}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{item.userCreatedEmail}</TableCell>
                                                <TableCell align="left">
                                                    {availableStatusesForUpdate.includes(item.status) && (
                                                        <Button
                                                            type="button"
                                                            variant={'contained'}
                                                            disabled={isStatusLoading}
                                                            size={'small'}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateManualGiveoutStatus(item.id, item.status);
                                                            }}
                                                        >
                                                            {isStatusLoading && (
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        paddingRight: '3px'
                                                                    }}
                                                                >
                                                                    <CircularProgress size={20} />
                                                                </Box>
                                                            )}
                                                            {t('Update Status')}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant={'contained'}
                                                        disabled={item.status !== 3 || isDownloadReportLoading}
                                                        size={'small'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            downloadReportClickHandler(item.id);
                                                        }}
                                                    >
                                                        {isDownloadReportLoading && (
                                                            <Box id={item.id}
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <CircularProgress id={item.id} size={20} />
                                                            </Box>
                                                        )}
                                                        {t('Create Manual Giveout Report')}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    );
                                })}
                            </TableStatic>

                            <TablePagination
                                count={-1}
                                onPageChange={handlePageChange}
                                page={page}
                                rowsPerPage={count}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            />
                        </Card>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default ManualGiveoutIndex;
