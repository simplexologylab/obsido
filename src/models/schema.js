export const schema = {
    "models": {
        "Stock": {
            "name": "Stock",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "ticker": {
                    "name": "ticker",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "classification": {
                    "name": "classification",
                    "isArray": false,
                    "type": {
                        "enum": "ClassificationType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": {
                        "enum": "StatusType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "overview": {
                    "name": "overview",
                    "isArray": false,
                    "type": {
                        "nonModel": "Overview"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "quote": {
                    "name": "quote",
                    "isArray": false,
                    "type": {
                        "nonModel": "Quote"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": {
                        "enum": "StockType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "holdings": {
                    "name": "holdings",
                    "isArray": true,
                    "type": {
                        "model": "Holding"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "stock"
                    }
                },
                "calculations": {
                    "name": "calculations",
                    "isArray": false,
                    "type": {
                        "nonModel": "Calculation"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Stocks",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byUpdatedAt",
                        "fields": [
                            "type",
                            "updatedAt"
                        ],
                        "queryField": "stocksByUpdatedAt"
                    }
                }
            ]
        },
        "Holding": {
            "name": "Holding",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "shares": {
                    "name": "shares",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "costBasis": {
                    "name": "costBasis",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "purchaseDate": {
                    "name": "purchaseDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": true,
                    "attributes": []
                },
                "brokerage": {
                    "name": "brokerage",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "soldDate": {
                    "name": "soldDate",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "notes": {
                    "name": "notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "stock": {
                    "name": "stock",
                    "isArray": false,
                    "type": {
                        "model": "Stock"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "holdingStockId"
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Holdings",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        }
    },
    "enums": {
        "ClassificationType": {
            "name": "ClassificationType",
            "values": [
                "Core",
                "Small",
                "Big"
            ]
        },
        "StatusType": {
            "name": "StatusType",
            "values": [
                "Watch",
                "Trim",
                "Hold",
                "Grow"
            ]
        },
        "StockType": {
            "name": "StockType",
            "values": [
                "Stock",
                "Fund"
            ]
        }
    },
    "nonModels": {
        "Overview": {
            "name": "Overview",
            "fields": {
                "exchange": {
                    "name": "exchange",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "currency": {
                    "name": "currency",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "sector": {
                    "name": "sector",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "marketCap": {
                    "name": "marketCap",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dividendYield": {
                    "name": "dividendYield",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "peRatio": {
                    "name": "peRatio",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "last52High": {
                    "name": "last52High",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "last52Low": {
                    "name": "last52Low",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dma50": {
                    "name": "dma50",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dma200": {
                    "name": "dma200",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Quote": {
            "name": "Quote",
            "fields": {
                "open": {
                    "name": "open",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "high": {
                    "name": "high",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "low": {
                    "name": "low",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "price": {
                    "name": "price",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "volume": {
                    "name": "volume",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "prevClose": {
                    "name": "prevClose",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "change": {
                    "name": "change",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "changePercent": {
                    "name": "changePercent",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Calculation": {
            "name": "Calculation",
            "fields": {
                "stockTotalShares": {
                    "name": "stockTotalShares",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockCostBasis": {
                    "name": "stockCostBasis",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockGainLoss": {
                    "name": "stockGainLoss",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockCurrentValue": {
                    "name": "stockCurrentValue",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockAvgPerShare": {
                    "name": "stockAvgPerShare",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockGainLossPercent": {
                    "name": "stockGainLossPercent",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockCAGR": {
                    "name": "stockCAGR",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockMAGR": {
                    "name": "stockMAGR",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "stockWAGR": {
                    "name": "stockWAGR",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "version": "12fca9dabe7654ed13da2cfaabff8e21"
};