export class CriteriaRequest {

    public ClientTimeZoneInfo: string;
    public IgnoreCaseInvariantCulture : boolean;
    public MaximumItemsToReturn : number;
    public ItemsToSkipFromBeginning : number;
    public PageNumber : number;
    public ItemsPerPage : number;
    public SortCriteria: SortInstruction[];
    public FilterCriteria: Filter[];
    public OperatorBetweenFilters: number;

    public CriteriaRequest() {
        this.ClientTimeZoneInfo = "";
        this.IgnoreCaseInvariantCulture = false;
        this.PageNumber = 1;
        this.FilterCriteria = [];
        this.SortCriteria = [];
       
    }
}


export class Filter {

    public LeftOperand: string;
    public RightOperand: any;
    public Operator: number;
    public OperandType: string;
    public GroupName: string;
    public GroupOperator: string;

    public Filter() {
        this.GroupName = "";
        this.GroupOperator = "";
        this.LeftOperand = "";
        this.OperandType = "";
        this.Operator = -1;
        this.RightOperand = "";
    }

}


export class SortInstruction {
    public ColumnName: string;
    public Direction: string;

    public SortInstruction() {
        this.ColumnName = "";
        this.Direction = "";
    }

}

export enum FilterOperator {
        EQUALSTO = 1,
        CONTAINS = 2,
        LESSTHAN = 3,
        GREATERTHAN = 4,
        AND = 5,
        OR = 6,
        STARTSWITH = 7,
        ENDSWITH = 8,
        IN = 9,
        NOTEQUAL = 10,
        LESSTHANOREQUALSTO = 11,
}