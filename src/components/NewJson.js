const dat = {
  Value: {
    "Transaction type": ["Sale", "Resell", "Lease"],
    "Type of client": ["Buyer", "Seller", "Lessee", "Lesser"],
    Vertical: [
      "Office",
      "Land",
      "Retail",
      "Investment",
      "Logistic",
      "Warehouse",
      "Others",
    ],
    "Vertical-type": [
      "Commercial Office",
      "Commercial",
      "Co-working",
      "Outright",
      "Joint Venture",
      "Joint Development",
      "Industrial",
      "Warehousing",
      "Show Room",
      "Mall",
      "Leasing",
      "Built to Suit",
      "School",
      "Others",
    ],
    "Sub vertical type": ["Commercial", "IT", "Office", "Mall", "Others"],
  },
  Dependency: {
    Sale: {
      Buyer: {
        Office: {
          "Commercial Office": {
            "Sub vertical type": ["Others"],
          },
          // "Commercial" : {
          //   "Sub vertical type": ["Others"]
          // },
          "Co-working": {
            "Sub vertical type": ["Others"],
          },
          // "Outright" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Venture" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Development" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Industrial" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Warehousing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Show Room" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Mall" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Leasing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Built to Suit" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "School" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Others" : {
          //   "Sub vertical type": ["Others"]
          // }
        },
        Land: {
          Commercial: {
            "Sub vertical type": ["IT", "Office", "Mall", "Others"],
          },
          Outright: {
            "Sub vertical type": ["Others"],
          },
          "Joint Venture": {
            "Sub vertical type": ["Commercial", "Others"],
          },
          "Joint Development": {
            "Sub vertical type": ["Others"],
          },
          Industrial: {
            "Sub vertical type": ["Others"],
          },
          Warehousing: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": ["Others"],
          },
          Mall: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Logistic: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Warehouse: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Others: {
          School: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
      },
      Seller: {
        Office: {
          "Commercial Office": {
            "Sub vertical type": ["Others"],
          },
          // "Commercial" : {
          //   "Sub vertical type": ["Others"]
          // },
          "Co-working": {
            "Sub vertical type": ["Others"],
          },
          // "Outright" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Venture" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Development" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Industrial" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Warehousing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Show Room" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Mall" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Leasing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Built to Suit" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "School" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Others" : {
          //   "Sub vertical type": ["Others"]
          // }
        },
        Land: {
          Commercial: {
            "Sub vertical type": ["Others"],
          },
          Outright: {
            "Sub vertical type": ["Others"],
          },
          "Joint Venture": {
            "Sub vertical type": ["Others"],
          },
          "Joint Development": {
            "Sub vertical type": ["Others"],
          },
          Industrial: {
            "Sub vertical type": ["Others"],
          },
          Warehousing: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": ["Others"],
          },
          Mall: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Logistic: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Warehouse: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Others: {
          School: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
      },
    },
    Lease: {
      Lesser: {
        Office: {
          Commercial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Outright: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Venture": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Development": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Industrial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Warehousing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Land: {
          Commercial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Outright: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Venture": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Development": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Industrial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Warehousing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Mall: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Logistic: {
          Leasing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Built to Suit": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Warehouse: {
          Leasing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Built to Suit": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Others: {
          School: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
      },
      Lessee: {
        Office: {
          Commercial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Outright: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Venture": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Development": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Industrial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Warehousing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Land: {
          Commercial: {
            "Sub vertical type": ["IT", "Office", "Mall", "Others"],
          },
          Outright: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Venture": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Joint Development": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Industrial: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Warehousing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Mall: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Logistic: {
          Leasing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Built to Suit": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Warehouse: {
          Leasing: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          "Built to Suit": {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
        Others: {
          School: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
          Others: {
            "Sub vertical type": [
              "Commercial",
              "IT",
              "Office",
              "Mall",
              "Others",
            ],
          },
        },
      },
    },

    Resell: {
      Buyer: {
        Office: {
          "Commercial Office": {
            "Sub vertical type": ["Others"],
          },
          // "Commercial" : {
          //   "Sub vertical type": ["Others"]
          // },
          "Co-working": {
            "Sub vertical type": ["Others"],
          },
          // "Outright" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Venture" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Development" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Industrial" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Warehousing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Show Room" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Mall" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Leasing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Built to Suit" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "School" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Others" : {
          //   "Sub vertical type": ["Others"]
          // }
        },
        Land: {
          Commercial: {
            "Sub vertical type": ["IT", "Office", "Mall", "Others"],
          },
          Outright: {
            "Sub vertical type": ["Others"],
          },
          "Joint Venture": {
            "Sub vertical type": ["Commercial", "Others"],
          },
          "Joint Development": {
            "Sub vertical type": ["Others"],
          },
          Industrial: {
            "Sub vertical type": ["Others"],
          },
          Warehousing: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": ["Others"],
          },
          Mall: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Logistic: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Warehouse: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Others: {
          School: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
      },
      Seller: {
        Office: {
          "Commercial Office": {
            "Sub vertical type": ["Others"],
          },
          // "Commercial" : {
          //   "Sub vertical type": ["Others"]
          // },
          "Co-working": {
            "Sub vertical type": ["Others"],
          },
          // "Outright" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Venture" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Joint Development" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Industrial" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Warehousing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Show Room" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Mall" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Leasing" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Built to Suit" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "School" : {
          //   "Sub vertical type": ["Others"]
          // },
          // "Others" : {
          //   "Sub vertical type": ["Others"]
          // }
        },
        Land: {
          Commercial: {
            "Sub vertical type": ["Others"],
          },
          Outright: {
            "Sub vertical type": ["Others"],
          },
          "Joint Venture": {
            "Sub vertical type": ["Others"],
          },
          "Joint Development": {
            "Sub vertical type": ["Others"],
          },
          Industrial: {
            "Sub vertical type": ["Others"],
          },
          Warehousing: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": ["Others"],
          },
          Mall: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Logistic: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Warehouse: {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Others: {
          School: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
      },
    },
  },
};

//eswar--------------
const data = {
  Value: {
    "Transaction type": ["Sale", "Lease"],
    "Type of client": ["Buyer", "Seller"],
    Vertical: [
      "Office",
      "Land",
      "Retail",
      "Investment",
      "Logistic",
      "Warehouse",
      "Others",
    ],
    "Vertical-type": [
      "Commercial Office",
      "Commercial",
      "Co-working",
      "Outright",
      "Joint Venture",
      "Joint Development",
      "Industrial",
      "Warehousing",
      "Show Room",
      "Mall",
      "Leasing",
      "Built to Suit",
      "School",
      "Others",
    ],
    "Sub vertical type": ["Commercial", "IT", "Office", "Mall", "Others"],
  },
  Dependency: {
    Sale: {
      Buyer: {
        Office: {
          "Commercial Office": {
            "Sub vertical type": ["Others"],
          },
          "Co Working": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
          "Co-working": {
            "Sub vertical type": ["Others"],
          },
        },
        Land: {
          Outright: {
            "Sub vertical type": ["Others"],
          },
          "Joint Venture": {
            "Sub vertical type": ["Residential", "Commercial", "Others"],
          },
          "Joint Development": {
            "Sub vertical type": ["Residential", "Commercial", "Others"],
          },
          Industrial: {
            "Sub vertical type": ["Others"],
          },
          Commercial: {
            "Sub vertical type": ["IT", "Office", "Mall", "Others"],
          },
          Warehousing: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": ["Others"],
          },
          Mall: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        "Logistic and Warehouse": {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },

        Others: {
          School: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
      },

      Seller: {
        Office: {
          "Commercial Office": {
            "Sub vertical type": ["Others"],
          },
          "Co Working": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
          "Co-working": {
            "Sub vertical type": ["Others"],
          },
        },
        Land: {
          Outright: {
            "Sub vertical type": ["Others"],
          },
          "Joint Venture": {
            "Sub vertical type": ["Residential", "Commercial", "Others"],
          },
          "Joint Development": {
            "Sub vertical type": ["Residential", "Commercial", "Others"],
          },
          Industrial: {
            "Sub vertical type": ["Others"],
          },
          Commercial: {
            "Sub vertical type": ["IT", "Office", "Mall", "Others"],
          },
          Warehousing: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Retail: {
          "Show Room": {
            "Sub vertical type": ["Others"],
          },
          Mall: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        Investment: {
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
        "Logistic and Warehouse": {
          Leasing: {
            "Sub vertical type": ["Others"],
          },
          "Built to Suit": {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },

        Others: {
          School: {
            "Sub vertical type": ["Others"],
          },
          Others: {
            "Sub vertical type": ["Others"],
          },
        },
      },
    },

    Lease: {
      Lesser: {
       "Office": {
            "Commercial Office" : {
              "Sub vertical type": ["Others"]
            },
            "Co Working" : {
              "Sub vertical type": ["Others"]
            },
            "Others" : {
              "Sub vertical type": ["Others"]
            },
            "Co-working" : {
              "Sub vertical type": ["Others"]
            },
          },
          "Land": {
            "Outright" : {
              "Sub vertical type": ["Others"]
            },
            "Joint Venture" : {
              "Sub vertical type": ["Residential","Commercial", "Others"]
            },
            "Joint Development" : {
              "Sub vertical type": ["Residential","Commercial", "Others"]
            },
            "Industrial" : {
              "Sub vertical type": ["Others"]
            },
            "Commercial" : {
              "Sub vertical type": ["IT", "Office", "Mall", "Others"]
            },
            "Warehousing" : {
              "Sub vertical type": ["Others"]
            },
            "Others" : {
              "Sub vertical type": ["Others"]
            }
          },
          "Retail": {
            "Show Room" : {
              "Sub vertical type": ["Others"]
            },
            "Mall" : {
              "Sub vertical type": ["Others"]
            },
            "Others" : {
              "Sub vertical type": ["Others"]
            },
          },
          "Investment": {
            "Others" : {
              "Sub vertical type": ["Others"]
            }
          },
          "Logistic and Warehouse": {
            "Leasing" : {
              "Sub vertical type": ["Others"]
            },
            "Built to Suit" : {
              "Sub vertical type": ["Others"]
            },
            "Others" : {
              "Sub vertical type": ["Others"]
            },
          },
  
          "Others": {
            "School" : {
              "Sub vertical type": ["Others"]
            },
            "Others" : {
              "Sub vertical type": ["Others"]
            },
          },
      },
      Lessee: {
        "Office": {
          "Commercial Office" : {
            "Sub vertical type": ["Others"]
          },
          "Co Working" : {
            "Sub vertical type": ["Others"]
          },
          "Others" : {
            "Sub vertical type": ["Others"]
          },
          "Co-working" : {
            "Sub vertical type": ["Others"]
          },
        },
        "Land": {
          "Outright" : {
            "Sub vertical type": ["Others"]
          },
          "Joint Venture" : {
            "Sub vertical type": ["Residential","Commercial", "Others"]
          },
          "Joint Development" : {
            "Sub vertical type": ["Residential","Commercial", "Others"]
          },
          "Industrial" : {
            "Sub vertical type": ["Others"]
          },
          "Commercial" : {
            "Sub vertical type": ["IT", "Office", "Mall", "Others"]
          },
          "Warehousing" : {
            "Sub vertical type": ["Others"]
          },
          "Others" : {
            "Sub vertical type": ["Others"]
          }
        },
        "Retail": {
          "Show Room" : {
            "Sub vertical type": ["Others"]
          },
          "Mall" : {
            "Sub vertical type": ["Others"]
          },
          "Others" : {
            "Sub vertical type": ["Others"]
          },
        },
        "Investment": {
          "Others" : {
            "Sub vertical type": ["Others"]
          }
        },
        "Logistic and Warehouse": {
          "Leasing" : {
            "Sub vertical type": ["Others"]
          },
          "Built to Suit" : {
            "Sub vertical type": ["Others"]
          },
          "Others" : {
            "Sub vertical type": ["Others"]
          },
        },

        "Others": {
          "School" : {
            "Sub vertical type": ["Others"]
          },
          "Others" : {
            "Sub vertical type": ["Others"]
          },
        },
      },
    },
  },
};
//---------------------
export const floornumber = [
  { value: "L Basement", label: "L Basement" },
  { value: "Upper Basement", label: "Upper Basement" },
  { value: "Ground Floor", label: "Ground Floor" },
  { value: "Upper Ground Floor", label: "Upper Ground Floor" },
  { value: "Lower Ground Floor", label: "Lower Ground Floor" },
  { value: "Parking 1", label: "Parking 1" },
  { value: "Parking 2", label: "Parking 2" },
  { value: "Parking 3", label: "Parking 3" },
  { value: "1st Floor", label: "1st Floor" },
  { value: "2nd Floor", label: "2nd Floor" },
  { value: "3rd Floor", label: "3rd Floor" },
  { value: "4th Floor", label: "4th Floor" },
  { value: "5th Floor", label: "5th Floor" },
  { value: "6th Floor", label: "6th Floor" },
  { value: "7th Floor", label: "7th Floor" },
  { value: "8th Floor", label: "8th Floor" },
  { value: "9th Floor", label: "9th Floor" },
  { value: "10th Floor", label: "10th Floor" },
  { value: "11th Floor", label: "11th Floor" },
  { value: "12th Floor", label: "12th Floor" },
  { value: "13th Floor", label: "13th Floor" },
  { value: "14th Floor", label: "14th Floor" },
  { value: "15th Floor", label: "15th Floor" },
  { value: "16th Floor", label: "16th Floor" },
  { value: "17th Floor", label: "17th Floor" },
  { value: "18th Floor", label: "18th Floor" },
  { value: "19th Floor", label: "19th Floor" },
  { value: "20th Floor", label: "20th Floor" },
  { value: "21st Floor", label: "21st Floor" },
  { value: "22nd Floor", label: "22nd Floor" },
  { value: "23rd Floor", label: "23rd Floor" },
  { value: "24th Floor", label: "24th Floor" },
  { value: "25th Floor", label: "25th Floor" }
];



export default data;
