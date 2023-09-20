export default {
  "dataModel":{
    "DataSource":"Sample ECommerce",
    "dimensions":[
      {
        "name":"Commerce",
        "attrs":[
          {
            "name":"AgeRange",
            "type":"text-attribute",
            "expression":"[Commerce.Age Range]"
          }
        ]
      },
      {
        "name":"Country",
        "attrs":[
          {
            "name":"Country",
            "type":"text-attribute",
            "expression":"[Country.Country]"
          },
          {
            "name":"CountryID",
            "type":"numeric-attribute",
            "expression":"[Country.Country ID]"
          }
        ]
      }
    ],
    "dataOptions":{
      "category":[
        {
          "name":"AgeRange",
          "type":"string"
        }
      ],
      "value":[
        {
          "name":"AgeRange"
        }
      ],
      "breakBy":[]
    }
  }};