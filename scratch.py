import json
import sys

claim_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Create Claim Application</title>
    <!-- Bootstrap 4 -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"/>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="~/alertify.js/alertify.core.css" />
    <link rel="stylesheet" href="~/alertify.js/alertify.default.css" />
    <style>
        html { font-size: 14px; }
        .select2-container .select2-selection--single {
            height: calc(1.5em + .75rem + 2px);
            border: 1px solid #d1d3e2;
            border-radius: 0.35rem;
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: calc(1.5em + .75rem);
            color: #6e707e;
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: calc(1.5em + .75rem);
        }
        .action-btns a { margin: 0 3px; transition: opacity 0.15s; }
        .action-btns a:hover { opacity: 0.7; }
        .action-btns .fa-trash-alt { color: #e74a3b; }
        .page-title-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
        }
        .page-title-text {
            font-size: 0.85rem;
            font-weight: 800;
            color: #5a5c69;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        .form-label {
            font-size: 0.78rem;
            font-weight: 700;
            color: #5a5c69;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 4px;
        }
        .form-control { font-size: 0.85rem; border-color: #d1d3e2; color: #6e707e; border-radius: 0.35rem; }
        .form-control:focus { border-color: #bac8f3; box-shadow: 0 0 0 0.2rem rgba(78,115,223,0.2); }
        .form-control[readonly] { background-color: #eaecf4; opacity: 1; }
        
        .card-header-custom {
            background-color: #4e73df;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.85rem;
            padding: 10px 15px;
        }
        .summary-panel {
            background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
            color: white;
            border-radius: 0.35rem;
            padding: 10px 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .summary-label {
            font-size: 0.78rem;
            text-transform: uppercase;
            font-weight: bold;
            opacity: 0.9;
            margin-bottom: 2px;
        }
        .summary-val {
            font-size: 1.1rem;
            font-weight: bold;
        }
    </style>
</head>
<body style="background:#f8f9fc;">
<div class="container-fluid py-3">

    <!-- PAGE HEADER -->
    <div class="card shadow mb-3">
        <div class="card-header py-3">
            <div class="page-title-bar">
                <div class="page-title-text">
                    <i class="fas fa-money-bill fa-sm text-primary mr-2"></i> Create Claim
                </div>
                <div class="ml-auto mt-2 mt-sm-0">
                    <a href="@Url.Action("ClaimIndex", "Master")" class="btn btn-secondary btn-sm shadow-sm">
                        <i class="fas fa-arrow-left fa-sm text-white-50 mr-1"></i> Back to List
                    </a>
                    <button type="button" class="btn btn-success btn-sm shadow-sm ml-2" onclick="saveClaim()">
                        <i class="fas fa-save fa-sm text-white-50 mr-1"></i> Save
                    </button>
                </div>
            </div>
        </div>
    </div>

    <form id="claimForm" autocomplete="off">
        <!-- COMMON HEADER CARD -->
        <div class="card shadow mb-4">
            <div class="card-header card-header-custom">Common Header</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-6 col-md-3 mb-3">
                        <label class="form-label">Doc No</label>
                        <input type="text" class="form-control" id="hdr-docno" readonly />
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <label class="form-label">Date</label>
                        <input type="text" class="form-control" id="hdr-date" readonly />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Employee</label>
                        <select class="form-control" id="hdr-employee" required>
                            <option value="">Select Employee...</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Designation</label>
                        <input type="text" class="form-control" id="hdr-designation" readonly />
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Department</label>
                        <input type="text" class="form-control" id="hdr-department" readonly />
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Reporting Manager</label>
                        <input type="text" class="form-control" id="hdr-manager" readonly />
                    </div>
                    
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Currency</label>
                        <select class="form-control" id="hdr-currency" required>
                            <option value="">Select Currency...</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Exchange Rate</label>
                        <input type="number" class="form-control" id="hdr-exrate" readonly />
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Payment Type</label>
                        <select class="form-control" id="hdr-paymenttype" required>
                            <option value="In Payroll">In Payroll</option>
                            <option value="Settlement">Settlement</option>
                        </select>
                    </div>
                    
                    <div class="col-md-8 mb-3">
                        <label class="form-label">Comments</label>
                        <textarea class="form-control" id="hdr-comments" rows="2"></textarea>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Attachment</label>
                        <input type="file" class="form-control p-1" id="hdr-attachment" />
                    </div>
                </div>
            </div>
        </div>

        <!-- CLAIM DETAILS CARD -->
        <div class="card shadow mb-4">
            <div class="card-header card-header-custom bg-info">Claim Details</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Claim Type</label>
                        <select class="form-control" id="dtl-claimtype" required>
                            <option value="">Select Claim Type...</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Amount</label>
                        <input type="number" class="form-control" id="dtl-amount" required min="0" step="0.01" />
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Ref No</label>
                        <input type="text" class="form-control" id="dtl-refno" />
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label">Ref Date</label>
                        <input type="text" class="form-control datepicker" id="dtl-refdate" />
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Attachment</label>
                        <input type="file" class="form-control p-1" id="dtl-attachment" />
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Remarks</label>
                        <input type="text" class="form-control" id="dtl-remarks" />
                    </div>
                    
                    <div class="col-md-12 text-right mt-2">
                        <button type="button" class="btn btn-primary btn-sm shadow-sm" onclick="addToGrid()">
                            <i class="fas fa-plus fa-sm text-white-50 mr-1"></i> Add to Grid
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- SUMMARY PANEL -->
        <div class="summary-panel mb-4 text-center">
            <div class="summary-label">Total Claim Amount</div>
            <div class="summary-val"><span id="sum-currency"></span> <span id="sum-amount">0.00</span></div>
        </div>
    </form>

    <div class="card shadow mb-4">
        <div class="card-header card-header-custom bg-secondary">User Grid</div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-bordered table-hover mb-0" id="user-grid-table">
                    <thead class="thead-light">
                        <tr>
                            <th style="width: 60px; text-align:center;">Action</th>
                            <th>Claim Type</th>
                            <th>Amount</th>
                            <th>Ref No</th>
                            <th>Ref Date</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="~/alertify.js/alertify.min.js"></script>
<script>
    var employeesData = [];
    var currencyData = [];
    var claimMasterData = [];
    var stagedClaims = [];

    $(document).ready(function() {
        initHeader();

        $.when(
            $.getJSON('/assets/employee.json'),
            $.getJSON('/assets/currency.json'),
            $.getJSON('/assets/claim_master.json')
        ).done(function(empRes, curRes, claimRes) {
            employeesData = empRes[0];
            currencyData = curRes[0];
            claimMasterData = claimRes[0];
            
            populateDropdowns();
        }).fail(function() {
            alertify.log('Failed to load JSON data from /assets/', 'error', 600);
        });

        $('#hdr-employee').change(onEmployeeChange);
        $('#hdr-currency').change(onCurrencyChange);

        $('#hdr-employee').select2({ width: '100%' });
        $('#dtl-claimtype').select2({ width: '100%' });
        $('#hdr-currency').select2({ width: '100%' });

        flatpickr(".datepicker", {
            dateFormat: "d/m/Y",
            defaultDate: "today"
        });
    });

    function initHeader() {
        var d = new Date();
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        var dd = String(d.getDate()).padStart(2, '0');
        var yy = String(d.getFullYear()).slice(-2);
        var yyyy = d.getFullYear();
        
        $('#hdr-date').val(dd + '/' + mm + '/' + yyyy);
        $('#hdr-docno').val('CLM-' + mm + '-' + yy + '-00001');
    }

    function populateDropdowns() {
        var empSelect = $('#hdr-employee');
        employeesData.forEach(function(emp) {
            empSelect.append(`<option value="${emp.id}">${emp.code} - ${emp.name}</option>`);
        });

        var curSelect = $('#hdr-currency');
        currencyData.forEach(function(cur) {
            curSelect.append(`<option value="${cur.id}">${cur.code} - ${cur.name}</option>`);
        });

        var claimSelect = $('#dtl-claimtype');
        claimMasterData.forEach(function(cm) {
            claimSelect.append(`<option value="${cm.id}">${cm.name}</option>`);
        });
    }

    function onEmployeeChange() {
        var empId = parseInt($(this).val());
        if (!empId) {
            $('#hdr-designation, #hdr-department, #hdr-manager').val('');
            return;
        }

        var emp = employeesData.find(e => e.id === empId);
        if (emp) {
            $('#hdr-designation').val(emp.designation);
            $('#hdr-department').val(emp.department);
            $('#hdr-manager').val(emp.reportingManager);
        }
    }
    
    function onCurrencyChange() {
        var curId = parseInt($(this).val());
        if (!curId) {
            $('#hdr-exrate').val('');
            $('#sum-currency').text('');
            return;
        }
        var cur = currencyData.find(c => c.id === curId);
        if (cur) {
            $('#hdr-exrate').val(cur.exRate);
            $('#sum-currency').text(cur.code);
        }
    }

    function renderGrid() {
        var uTbody = $('#user-grid-table tbody');
        uTbody.empty();
        var totalAmount = 0;
        
        stagedClaims.forEach(function(item) {
            var tr = `<tr>
                <td class="action-btns" style="text-align:center;">
                    <a href="#" class="remove-item-btn" title="Delete" onclick="deleteStagedClaim('${item.stagedId}'); return false;"><i class="fas fa-trash-alt fa-sm fa-fw"></i></a>
                </td>
                <td>${item.claimTypeName || '-'}</td>
                <td>${item.amount.toFixed(2)}</td>
                <td>${item.refNo || '-'}</td>
                <td>${item.refDate || '-'}</td>
                <td>${item.remarks || '-'}</td>
            </tr>`;
            uTbody.append(tr);
            totalAmount += item.amount;
        });
        
        $('#sum-amount').text(totalAmount.toFixed(2));
    }

    function deleteStagedClaim(stagedId) {
        alertify.confirm('Are you sure you want to remove this claim?', function (e) {
            if (e) {
                stagedClaims = stagedClaims.filter(function(item) { return item.stagedId !== stagedId; });
                renderGrid();
            }
        });
    }

    function addToGrid() {
        var claimTypeId = $('#dtl-claimtype').val();
        var amount = parseFloat($('#dtl-amount').val()) || 0;
        
        if(!claimTypeId || amount <= 0) {
            alertify.log('Please select Claim Type and enter a valid Amount.', 'error', 600);
            return;
        }

        var claimTypeName = $('#dtl-claimtype option:selected').text();
        var refNo = $('#dtl-refno').val();
        var refDate = $('#dtl-refdate').val();
        var remarks = $('#dtl-remarks').val();

        var uniqueStagedId = 'id_' + new Date().getTime();

        var newItem = {
            stagedId: uniqueStagedId,
            claimTypeId: claimTypeId,
            claimTypeName: claimTypeName,
            amount: amount,
            refNo: refNo,
            refDate: refDate,
            remarks: remarks
        };

        stagedClaims.push(newItem);
        renderGrid();
        
        // Reset inputs
        $('#dtl-claimtype').val('').trigger('change');
        $('#dtl-amount').val('');
        $('#dtl-refno').val('');
        $('#dtl-remarks').val('');
    }

    function saveClaim() {
        if (stagedClaims.length === 0) {
            alertify.log('No claims added to the grid.', 'error', 600);
            return;
        }

        if(!$('#hdr-employee').val() || !$('#hdr-currency').val()) {
            alertify.log('Please fill required Header fields.', 'error', 600);
            return;
        }

        alertify.set({ delay: 600 });
        alertify.log('Claim saved successfully!', 'success', 600);
        setTimeout(function() {
            window.location.href = '@Url.Action("ClaimIndex", "Master")';
        }, 600);
    }
</script>
</body>
</html>
"""

with open('/home/edwinsm/Documents/GITHUB/Neoxis/V1/HCMSys/Views/Master/CreateClaim.cshtml', 'w') as f:
    f.write(claim_content)

print("Created CreateClaim.cshtml")
