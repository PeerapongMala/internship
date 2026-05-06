import { useEffect, useState } from 'react';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { useParams } from '@tanstack/react-router';
import API from '@domain/g03/g03-d03/local/api';
import {
  TTestPairModelStatResponse,
  StudentGroupResearchQueryParams,
} from '@domain/g03/g03-d03/local/api/group/student-group-research/type';
import { roundNumber } from '@global/utils/number';

interface WcModalTTestPairViewProps extends ModalProps {
  open: boolean;
  onClose?: () => void;
  filters: StudentGroupResearchQueryParams;
  studentGroup: string;
}

const WcModalTTestPairView = ({
  open,
  onClose,
  filters,
  studentGroup,
}: WcModalTTestPairViewProps) => {
  const { studentGroupId } = useParams({ strict: false });
  const [records, setRecords] = useState<TTestPairModelStatResponse>();

  useEffect(() => {
    if (open && studentGroupId) {
      API.studentGroupResearch
        .GetTTestPairModelStatResult(+studentGroupId, filters)
        .then((res) => {
          if (res.status_code === 200) {
            setRecords(res.data);
          }
        });
    }
  }, [open, studentGroupId, filters]);

  const round = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return roundNumber(value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="t-Test Paired Two Sample For Means"
      className="mx-auto max-w-3xl"
    >
      <div className="grid grid-cols-4">
        {/* Header */}
        <div className="col-span-1"></div>
        <div className="col-span-1 text-right font-bold">ก่อนเรียน</div>
        <div className="col-span-1 text-right font-bold">หลังเรียน</div>
        <div className="col-span-1 text-right font-bold"></div>

        {/* Mean */}
        <div className="col-span-1 py-2">Mean</div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.mean?.pre_test_score)}
        </div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.mean?.post_test_score)}
        </div>
        <div className="col-span-1"></div>

        {/* Variance */}
        <div className="col-span-1 py-2">Variance</div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.variance?.pre_test_score)}
        </div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.variance?.post_test_score)}
        </div>
        <div className="col-span-1"></div>

        {/* Observations */}
        <div className="col-span-1 py-2">Observations</div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.observations?.pre_test_score)}
        </div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.observations?.post_test_score)}
        </div>
        <div className="col-span-1"></div>

        {/* Pearson Correlation */}
        <div className="col-span-1 py-2">Pearson Correlation</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.pearson_correlation)}
        </div>

        {/* Hypothesized Mean Difference */}
        <div className="col-span-1 whitespace-nowrap py-2">
          Hypothesized Mean Difference
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.hypothesized_mean_difference)}
        </div>

        {/* df */}
        <div className="col-span-1 py-2">df</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">{records?.df ?? '-'}</div>

        {/* t Stat */}
        <div className="col-span-1 py-2">t Stat</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">{round(records?.t_stat)}</div>

        {/* p and critical values */}
        <div className="col-span-1 py-2">P(T&lt;=t) one-tail</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">{round(records?.p_one_tail)}</div>

        <div className="col-span-1 py-2">t Critical one-tail</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.t_critical_one_tail)}
        </div>

        <div className="col-span-1 py-2">P(T&lt;=t) two-tail</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">{round(records?.p_two_tail)}</div>

        <div className="col-span-1 py-2">t Critical two-tail</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 py-2 text-right">
          {round(records?.t_critical_two_tail)}
        </div>

        {/* Test Score Section */}
        <div className="col-span-1 mt-10 font-bold">คะเเนนสอบ</div>
        <div className="col-span-1 mt-10 text-right font-bold">ก่อนเรียน</div>
        <div className="col-span-1 mt-10 text-right font-bold">หลังเรียน</div>
        <div className="col-span-1 mt-10"></div>

        <div className="col-span-1 mt-5 py-1">n</div>
        <div className="col-span-1 mt-5 text-right">
          {records?.TestScore?.n?.pre_test_score ?? '-'}
        </div>
        <div className="col-span-1 mt-5 text-right">
          {records?.TestScore?.n?.post_test_score ?? '-'}
        </div>
        <div className="col-span-1 mt-5"></div>

        <div className="col-span-1 py-1">Mean</div>
        <div className="col-span-1 text-right">
          {round(records?.TestScore?.mean?.pre_test_score)}
        </div>
        <div className="col-span-1 text-right">
          {round(records?.TestScore?.mean?.post_test_score)}
        </div>
        <div className="col-span-1"></div>

        <div className="col-span-1 py-1">S.D.</div>
        <div className="col-span-1 text-right">
          {round(records?.TestScore?.sd?.pre_test_score)}
        </div>
        <div className="col-span-1 text-right">
          {round(records?.TestScore?.sd?.post_test_score)}
        </div>
        <div className="col-span-1"></div>

        <div className="col-span-1 py-1">t</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 text-right">{round(records?.TestScore?.t)}</div>

        <div className="col-span-1 py-1">df</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 text-right">{records?.TestScore?.df ?? '-'}</div>

        <div className="col-span-1 py-1">sig</div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1 text-right">{records?.TestScore?.sig ?? '-'}</div>

        {/* Footer */}
        <div className="col-span-4 mb-10 mt-2">
          <span className="text-red-600">*</span>
          <span>ระดับนัยสำคัญที่ .05</span>
        </div>

        <div className="col-span-4">
          <p className="mt-2">
            จากตาราง พบว่า {`"${studentGroup}"`} มีผลสัมฤทธิ์ทางการเรียนคณิตศาสตร์
            หลังเรียน ไม่แตกต่างกับก่อนเรียน อย่างมีนัยสำคัญที่ระดับ .05 โดยมีค่า t=
            {round(records?.TestScore?.t)}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default WcModalTTestPairView;
